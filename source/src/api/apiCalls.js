import axios from 'axios';
import i18n from '../locales/i18n';

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

const login = (creds) => axios.post('/api/1.0/auth', creds);

export {
  signUp, activate, loadUsers, getUserById, login,
};
