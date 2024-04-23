import React from 'react';
import './App.css';
import { usePath } from './shared/hooks/usePath';
import { PaginatedTable } from './pages/paginated-table/PaginatedTable';
import { InfiniteScroll } from './pages/infinite-scroll/InfiniteScroll';

export const App: React.FC = () => {
  const path = usePath();

  return (
    <div className="app">
      <aside>
        <nav>
          <ul>
            <li>
              <a href='/paginated-table'>
                Paginated Table
              </a>
            </li>
            <li>
              <a href='/infinite-scroll'>
                Infinite Scroll
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <main>
        {path === '/paginated-table' ? <PaginatedTable /> : null}
        {path === '/infinite-scroll' ? <InfiniteScroll /> : null}
      </main>
    </div>
  )
}