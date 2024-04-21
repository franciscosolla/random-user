import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { ApiResponse, User } from './types';
import { useParams } from './hooks/useParams';
import { goTo } from './functions/goTo';
import { getParams } from './functions/getParams';

export const App: React.FC = () => {
  const [seed, setSeed] = useState<string>();
  const [user, setUser] = useState<User>();
  const params = useParams();

  const page = params.get("page") ?? "1";
  const results = params.get("results") ?? "1";

  useEffect(() => {
    fetch(`https://randomuser.me/api?page=${page}&results=${results}${seed ? `&seed=${seed}` : ""}`)
      .then(response => response.json() as Promise<ApiResponse>)
      .then(data => {
        if (data.info.page === Number(page)) {
          setUser(data.results[0]);
          setSeed(data.info.seed);
        }
      });
  }, [page, results]);

  if (!user) return null;

  return (
    <div>
      <div>
        <img src={user.picture.large} alt="Profile" />
        <h1>{`${user.name.title} ${user.name.first} ${user.name.last}`}</h1>
      </div>
      <form>
        <input type="button" value="<" onClick={goToPreviousPage} />
        <span>{page}</span>
        <input type="button" value=">" onClick={goToNextPage} />
      </form>
    </div>
  );
}

const getPage = () => Number(getParams().get("page"));

const goToPreviousPage = () =>  {
  const page = getPage();

  if (page > 1) {
    goTo(`/?page=${page - 1}`);
  }
}

const goToNextPage = () => goTo(`/?page=${getPage() + 1}`);
