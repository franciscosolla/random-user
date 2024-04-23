import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { PaginatedTable } from './PaginatedTable';

const fetch = jest.fn()
global.fetch = fetch;

describe('App', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    fetch.mockClear();
  });

  it('loads and displays entries', async () => {
    // Mock the fetch call within this test
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          info: { seed: 'some-seed', page: 1 },
          results: [{
            name: { first: 'John', last: 'Doe' },
            picture: { thumbnail: 'url-to-image' },
            location: {
              city: 'City',
              state: 'State',
              country: 'Country',
              postcode: 'Postcode',
              street: { number: 123, name: 'Street Name' },
              coordinates: { latitude: '0', longitude: '0' },
              timezone: { offset: '+0:00', description: 'UTC' }
            }
          }]
        })
      })
    );

    render(<PaginatedTable />);

    // Use waitFor to handle asynchronous updates
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
    });

    // Verify that fetch was called correctly
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('https://randomuser.me/api'), { signal: expect.any(AbortSignal) });
  });

  afterEach(() => {
    // Restore fetch to its original state if needed
    fetch.mockRestore();
  });
});
