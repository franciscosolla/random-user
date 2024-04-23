import React, { useEffect, useState } from 'react';
import './PaginatedTable.css';
import { Entry } from './types';
import { useParams } from './hooks/useParams';
import { HEADERS } from './constants/headers';
import { mapUserToEntry } from './functions/mapUserToEntry';
import { updatePage } from './functions/updatePage';
import { getParams } from './functions/getParams';
import { ApiResponse } from '../../shared/types/RandomUserApi';

export const PaginatedTable: React.FC = () => {
  const [seed, setSeed] = useState<string>();
  const [entries, setEntries] = useState<Entry[]>();
  const params = useParams();
  const [sortBy, setSortBy] = useState<typeof HEADERS[number]["key"]>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "default">();
  const [filter, setFilter] = useState<string>();
  const [isFilterFoccused, setIsFilterFoccused] = useState<boolean>(false);

  const page = params.get("page") ?? "1";
  const results = params.get("results") ?? "1";

  useEffect(() => {
    const controller = new AbortController();

    fetch(`https://randomuser.me/api?page=${page}&results=${results}${seed ? `&seed=${seed}` : ""}&inc=name,picture,location`, {
      signal: controller.signal,
    })
      .then(response => response.json() as Promise<ApiResponse>)
      .then(data => {
        if (data.info.page === Number(page)) {
          setEntries(data.results.map(mapUserToEntry));
          setSeed(data.info.seed);
        }
      }).catch(console.error);

    return () => controller.abort();
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

  const filterValue = (value: Entry[keyof Entry]) => {
    if (!filter) return true;
    return typeof value === "string" ? value.toLowerCase().includes(filter.toLowerCase()) : value === Number(filter)
  }

  const getEntries = () => {
    let filteredEntries = entries;

    if (filter) {
      filteredEntries = filteredEntries.filter(entry => Object.values(entry).some(filterValue))
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

  const getAutocompleteValues = (): Entry[keyof Entry][] => {
    return Array.from(new Set(getEntries().flatMap(entry => Object.values(entry).filter(filterValue))).values());
  }

  return (
    <div className="container">
      <form>
        <label>
          Results
          <span>
            {getEntries().length}{" / "}
            <input type="number" min={1} max={50} defaultValue={results} onChange={e => updatePage({ results: e.target.value })} />
          </span>
        </label>
        <label onBlur={() => setIsFilterFoccused(false)}>
          Filter
          <input
            type="text"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            onFocus={() => setIsFilterFoccused(true)}
          />
          {isFilterFoccused && filter?.length && filter.length > 2 && getAutocompleteValues().length ? (
            <ul>
              {getAutocompleteValues().map(value => (
                <li key={value} onMouseDown={() => setFilter(String(value))}>
                  {value}
                </li>
              ))}
            </ul>
          ) : null}
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


