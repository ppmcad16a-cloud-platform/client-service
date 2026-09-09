/**
 *
 * graphql.js
 *
 * Shared POST helper for commerce_server's single GraphQL endpoint (cart,
 * order, merchant — see CLAUDE.md's commerce_server section for why it's
 * GraphQL while every other service is still REST). Plain axios, same as
 * every other service call in this app — the Authorization header is
 * already attached globally via utils/token.js's axios.defaults, and a
 * non-2xx response still rejects the returned promise the normal axios
 * way, so every existing action's `catch (error) { handleError(error,
 * dispatch); }` keeps working completely unchanged: commerce_server's
 * GraphQL view (app/graphql/view.py) deliberately replies with the same
 * REST-shaped status/body (401/403/400 + `{error}`, or 404 + `{message}`)
 * `handleError` already knows how to read, instead of the GraphQL spec's
 * usual "always 200, errors in the body" convention.
 */

import axios from 'axios';

import { API_URL } from '../constants';

const graphqlRequest = (query, variables) =>
  axios
    .post(`${API_URL}/graphql`, { query, variables })
    .then(response => response.data.data);

export default graphqlRequest;
