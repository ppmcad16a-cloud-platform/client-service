import '@testing-library/jest-dom/vitest';

// Baked in at build time in the real app (via dotenv-webpack reading
// client/.env) — set directly here since Vitest doesn't run webpack.
process.env.API_URL = 'http://localhost:3000/api';

afterEach(() => {
  localStorage.clear();
});
