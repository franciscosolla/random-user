import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { ApiResponse, User } from './types';
import { useParams } from './hooks/useParams';
import { goTo } from './functions/goTo';
import { getParams } from './functions/getParams';

export const App: React.FC = () => {
  const [seed, setSeed] = useState<string>();
  const [users, setUsers] = useState<User[]>();
  const params = useParams();

  const page = params.get("page") ?? "1";
  const results = params.get("results") ?? "1";

  useEffect(() => {
    fetch(`https://randomuser.me/api?page=${page}&results=${results}${seed ? `&seed=${seed}` : ""}&inc=name,picture`)
      .then(response => response.json() as Promise<ApiResponse>)
      .then(data => {
        if (data.info.page === Number(page)) {
          setUsers(data.results);
          setSeed(data.info.seed);
        }
      });
  }, [page, results]);

  if (!users?.length) return null;

  return (
    <div className="container">
      <form>
        <label>
          Results
          <input type="number" min={1} max={50} defaultValue={results} onChange={e => updatePage({ results: e.target.value })} />
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
      <ul>
        {users.map(user => (
          <li key={`${user.name.title}-${user.name.first}-${user.name.last}`}>
            <img src={user.picture.large} alt="Profile" width={50} />
            <h1>{`${user.name.title} ${user.name.first} ${user.name.last}`}</h1>
          </li> 
        ))}
      </ul>
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
