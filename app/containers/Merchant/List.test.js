import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import List from 'app/containers/Merchant/List';
import renderWithProviders from '../../../tests/renderWithProviders';
import { API_URL, ROLES, MERCHANT_STATUS } from 'app/constants';

const mock = new MockAdapter(axios);
const GRAPHQL_URL = `${API_URL}/graphql`;

afterEach(() => {
  mock.reset();
});

const merchant = {
  _id: '1',
  business: 'Acme Co',
  brandName: 'Acme',
  name: 'Jane Doe',
  email: 'jane@example.com',
  phoneNumber: '1234567890',
  created: '2024-01-01T00:00:00.000Z',
  status: MERCHANT_STATUS.Waiting_Approval
};

// Every merchant mutation (approve/reject/delete/setActive) triggers a
// follow-up list-or-search re-fetch afterward, and all of it — the initial
// load, the mutation, and the re-fetch — now goes through the same POST
// /api/graphql endpoint. Tests that exercise more than one of those in a
// single render dispatch by the request body's operation name instead of
// by URL/method the way the old REST mocks did.
const byOperation = handlers => config => {
  const { query } = JSON.parse(config.data);
  const match = handlers.find(([name]) => query.includes(`query ${name}`) || query.includes(`mutation ${name}`));
  return match ? [200, { data: match[1] }] : [500, {}];
};

const postedOperationNames = () =>
  mock.history.post.map(r => JSON.parse(r.data).query.match(/(?:query|mutation)\s+(\w+)/)?.[1]);

it('fetches merchants on mount and renders them with pagination when there are multiple pages', async () => {
  mock.onPost(GRAPHQL_URL).reply(200, {
    data: { merchants: { merchants: [merchant], totalPages: 2, currentPage: 1, count: 15 } }
  });

  renderWithProviders(<List history={{ push: vi.fn() }} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  expect(await screen.findByText('Acme Co')).toBeInTheDocument();
  expect(screen.getByText('15 merchants')).toBeInTheDocument();
  expect(document.querySelector('.pagination')).toBeInTheDocument();
});

it('shows "No merchants found." when the list is empty', async () => {
  mock.onPost(GRAPHQL_URL).reply(200, { data: { merchants: { merchants: [], totalPages: 1, currentPage: 1, count: 0 } } });

  renderWithProviders(<List history={{ push: vi.fn() }} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  expect(await screen.findByText('No merchants found.')).toBeInTheDocument();
});

it('navigates to the add-merchant page when "Add" is clicked (admin only)', async () => {
  mock.onPost(GRAPHQL_URL).reply(200, { data: { merchants: { merchants: [], totalPages: 1, currentPage: 1, count: 0 } } });
  const history = { push: vi.fn() };

  renderWithProviders(<List history={history} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  await screen.findByText('No merchants found.');
  fireEvent.click(screen.getByRole('button', { name: 'Add' }));

  expect(history.push).toHaveBeenCalledWith('/dashboard/merchant/add');
});

// SearchBar's debounce (see components/Common/SearchBar) never clears its
// pending setTimeout on unmount, so a real 1s wait here risks the timer
// firing during a *later* test (after this one's own component unmounts)
// and calling setState on it — fake timers let us flush the debounce
// deterministically inside this test instead.
it('searches merchants (2+ chars) and shows the search-scoped count without pagination', async () => {
  mock.onPost(GRAPHQL_URL).reply(
    byOperation([
      ['Merchants', { merchants: { merchants: [merchant], totalPages: 2, currentPage: 1, count: 15 } }],
      ['MerchantSearch', { merchantSearch: { merchants: [{ ...merchant, _id: '2', name: 'Bob' }] } }]
    ])
  );

  renderWithProviders(<List history={{ push: vi.fn() }} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  await screen.findByText('Acme Co');

  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  fireEvent.change(screen.getByPlaceholderText('Type email, phone number, brand or status'), {
    target: { value: 'bo' }
  });
  vi.advanceTimersByTime(1000);
  vi.useRealTimers();

  expect(await screen.findByText('Bob')).toBeInTheDocument();
  expect(screen.getByText('1 merchants')).toBeInTheDocument();
  expect(document.querySelector('.pagination')).not.toBeInTheDocument();
});

it('clears the search (fewer than 2 chars) and falls back to the plain merchants list', async () => {
  mock.onPost(GRAPHQL_URL).reply(
    byOperation([
      ['Merchants', { merchants: { merchants: [merchant], totalPages: 1, currentPage: 1, count: 1 } }],
      ['MerchantSearch', { merchantSearch: { merchants: [{ ...merchant, _id: '2', name: 'Bob' }] } }]
    ])
  );

  renderWithProviders(<List history={{ push: vi.fn() }} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  await screen.findByText('Acme Co');

  const search = screen.getByPlaceholderText('Type email, phone number, brand or status');

  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  fireEvent.change(search, { target: { value: 'bo' } });
  vi.advanceTimersByTime(1000);
  vi.useRealTimers();
  await screen.findByText('Bob');

  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  fireEvent.change(search, { target: { value: 'b' } });
  vi.advanceTimersByTime(1000);
  vi.useRealTimers();

  expect(await screen.findByText('Acme Co')).toBeInTheDocument();
});

it('approves a merchant from the list, scoped to the current search/page', async () => {
  mock.onPost(GRAPHQL_URL).reply(
    byOperation([
      ['Merchants', { merchants: { merchants: [merchant], totalPages: 1, currentPage: 1, count: 1 } }],
      ['ApproveMerchant', { approveMerchant: { success: true } }]
    ])
  );

  renderWithProviders(<List history={{ push: vi.fn() }} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  await screen.findByText('Acme Co');
  fireEvent.click(document.getElementById('tooltip-approve-1'));

  await vi.waitFor(() => expect(postedOperationNames()).toContain('ApproveMerchant'));
});

it('rejects a merchant from the list, scoped to the current search/page', async () => {
  mock.onPost(GRAPHQL_URL).reply(
    byOperation([
      ['Merchants', { merchants: { merchants: [merchant], totalPages: 1, currentPage: 1, count: 1 } }],
      ['RejectMerchant', { rejectMerchant: { success: true } }]
    ])
  );

  renderWithProviders(<List history={{ push: vi.fn() }} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  await screen.findByText('Acme Co');
  fireEvent.click(document.getElementById('tooltip-reject-1'));

  await vi.waitFor(() => expect(postedOperationNames()).toContain('RejectMerchant'));
});

it('deletes a merchant from the list, scoped to the current search/page', async () => {
  mock.onPost(GRAPHQL_URL).reply(
    byOperation([
      ['Merchants', { merchants: { merchants: [merchant], totalPages: 1, currentPage: 1, count: 1 } }],
      ['DeleteMerchant', { deleteMerchant: { success: true, message: 'Deleted!' } }]
    ])
  );

  renderWithProviders(<List history={{ push: vi.fn() }} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  await screen.findByText('Acme Co');
  fireEvent.click(document.getElementById('tooltip-delete-1'));

  await vi.waitFor(() => expect(postedOperationNames()).toContain('DeleteMerchant'));
});

it('disables an approved merchant from its list popover, scoped to the current search/page', async () => {
  const approvedMerchant = { ...merchant, status: MERCHANT_STATUS.Approved, isActive: true };
  mock.onPost(GRAPHQL_URL).reply(
    byOperation([
      ['Merchants', { merchants: { merchants: [approvedMerchant], totalPages: 1, currentPage: 1, count: 1 } }],
      ['SetMerchantActive', { setMerchantActive: { success: true } }]
    ])
  );

  renderWithProviders(<List history={{ push: vi.fn() }} />, {
    preloadedState: { account: { user: { role: ROLES.Admin } } }
  });

  await screen.findByText('Acme Co');
  // The popover's own content (with the button that actually calls
  // disableMerchant) isn't rendered until the trigger button opens it.
  fireEvent.click(screen.getByText('Disable Merchant'));

  // findAllByText resolves as soon as *any* match exists — the trigger
  // button alone satisfies that immediately, racing ahead of the popover's
  // fade-in transition actually mounting its second (real) button. Wait
  // for the count to reach 2 instead of just "any match".
  await vi.waitFor(() => expect(screen.getAllByText('Disable Merchant')).toHaveLength(2));
  const disableButtons = screen.getAllByText('Disable Merchant');
  fireEvent.click(disableButtons[disableButtons.length - 1]);

  await vi.waitFor(() => expect(postedOperationNames()).toContain('SetMerchantActive'));
});
