import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { ApiResponse, Entry, Header } from './types';
import { useParams } from './hooks/useParams';
import { goTo } from './functions/goTo';
import { getParams } from './functions/getParams';
import { mapUserToEntry } from './functions/mapUserToEntry';

export const App: React.FC = () => {
  const [seed, setSeed] = useState<string>();
  const [entries, setEntries] = useState<Entry[]>();
  const params = useParams();
  const [sortBy, setSortBy] = useState<typeof HEADERS[number]["key"]>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "default">();
  const [filter, setFilter] = useState<string>();

  const page = params.get("page") ?? "1";
  const results = params.get("results") ?? "1";

  useEffect(() => {
    fetch(`https://randomuser.me/api?page=${page}&results=${results}${seed ? `&seed=${seed}` : ""}&inc=name,picture,location`)
      .then(response => response.json() as Promise<ApiResponse>)
      .then(data => {
        if (data.info.page === Number(page)) {
          setEntries(data.results.map(mapUserToEntry));
          setSeed(data.info.seed);
        }
      });
  }, [page, results]);

  if (!entries?.length) return null;

  const onClickHeader = (key: typeof HEADERS[number]["key"]) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "default" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  }

  const getEntries = () => {
    let filteredEntries = entries;

    if (filter) {
      filteredEntries = filteredEntries.filter(entry => Object.values(entry).some((value: Entry[keyof Entry]) => typeof value === "string" ? value.toLowerCase().includes(filter.toLowerCase()) : value === Number(filter)))
    }

    if (!sortBy || sortOrder === "default") return filteredEntries;

    return filteredEntries.slice().sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });
  }

  return (
    <div className="container">
      <form>
        <label>
          Results
          <input type="number" min={1} max={50} defaultValue={results} onChange={e => updatePage({ results: e.target.value })} />
        </label>
        <label>
          Filter
          <input type="text" onChange={e => setFilter(e.target.value)} />
        </label>
        <label>
          Page
          <div>
            <input type="button" value="<" onClick={goToPreviousPage} />
            <input className="page-input" type="number" min={1} value={page} onChange={e => updatePage({ page: Number(e.target.value) })} />
            <input type="button" value=">" onClick={goToNextPage} />
          </div>
        </label>
      </form>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {HEADERS.map(header => (
                <th key={header.key}>
                  <button onClick={() => onClickHeader(header.key)}>{header.label}</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getEntries().map(entry => (
              <tr key={entry.key}>
                {HEADERS.map(({ key }) => key === 'picture_thumbnail' ? (
                  <td key={key}><img src={entry[key]} alt="Profile" width={50} /></td>
                ) : (
                  <td key={key}>{entry[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const getPage = () => Number(getParams().get("page"));

const goToPreviousPage = () =>  {
  const page = getPage();

  if (page > 1) {
    updatePage({ page: page - 1 });
  }
}

const goToNextPage = () => updatePage({ page: getPage() + 1 });

const updatePage = ({ page, results }: { page?: number, results?: string }) => {
  const params = getParams();

  if (page) {
    params.set("page", String(page));
  }

  if (results) {
    params.set("results", results);
  }

  goTo(`/?${params.toString()}`);
}

const HEADERS: Header[] = [
  { key: 'picture_thumbnail', label: 'Picture' },
  { key: 'name_first', label: 'Name' },
  { key: 'location_city', label: 'City' },
  { key: 'location_state', label: 'State' },
  { key: 'location_country', label: 'Country' },
  { key: 'location_postcode', label: 'Postcode' },
  { key: 'street_number', label: 'Street Number' },
  { key: 'street_name', label: 'Street Name' },
  { key: 'coordinates_latitude', label: 'Latitude' },
  { key: 'coordinates_longitude', label: 'Longitude' },
  { key: 'timezone_offset', label: 'Timezone Offset' },
  { key: 'timezone_description', label: 'Timezone Description' },
];