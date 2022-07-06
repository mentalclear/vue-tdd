import axios from 'axios';
import i18n from '../locales/i18n';

// Suggested use of interceptors caused stuck tests.
// Will need to figure out why this is happening... not clear.
// axios.interceptors.request.use((request) => {
//   // eslint-disable-next-line no-param-reassign
//   request.headers['Accept-Language'] = i18n.global.locale;
//   return request;
// });

const signUp = (body) => axios.post('/api/1.0/users', body, {
  headers: {
    'Accept-Language': i18n.global.locale,
  },
});

const activate = (token) => axios.post(`/api/1.0/users/token/${token}`);

const loadUsers = (page) => axios.get('/api/1.0/users', {
  params: {
    page,
    size: 3,
  },
});

const getUserById = (id) => axios.get(`/api/1.0/users/${id}`);

const login = (creds) => axios.post('/api/1.0/auth', creds, {
  headers: {
    'Accept-Language': i18n.global.locale,
  },
});

export {
  signUp, activate, loadUsers, getUserById, login,
};
