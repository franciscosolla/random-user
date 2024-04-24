import React from 'react';
import './App.css';
import { usePath } from './shared/hooks/usePath';
import { PaginatedTable } from './pages/paginated-table/PaginatedTable';
import { StoreProviderList } from './pages/store-provider-list/StoreProviderList';
import { LocalStateList } from './pages/local-state-list/LocalStateList';

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
              <a href='/store-provider-list'>
                Store Provider List
              </a>
            </li>
            <li>
              <a href="local-state-list">
                Local State List
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <main>
        {path === '/paginated-table' ? <PaginatedTable /> : null}
        {path === '/store-provider-list' ? <StoreProviderList /> : null}
        {path === '/local-state-list' ? <LocalStateList /> : null}
      </main>
    </div>
  )
}