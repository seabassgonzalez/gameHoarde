const React = require('react');

module.exports = {
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
  }),
  useParams: () => ({}),
  Link: ({ children }) => React.createElement('a', {}, children),
  NavLink: ({ children }) => React.createElement('a', {}, children),
  BrowserRouter: ({ children }) => React.createElement('div', {}, children),
  Routes: ({ children }) => React.createElement('div', {}, children),
  Route: ({ element }) => element,
};