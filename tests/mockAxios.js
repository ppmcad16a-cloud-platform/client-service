import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// One shared mock-adapter factory reused across actions.js/thunk tests —
// axios's default export is a singleton, so each test file's own
// `beforeEach`/`afterEach` should call `.reset()` (clears handlers, keeps
// the adapter installed) between tests.
const createMockAxios = () => new MockAdapter(axios);

export default createMockAxios;
