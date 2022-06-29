import axios from 'axios';
import i18n from '../locales/i18n';

const signUp = (body) => axios.post('/api/1.0/users', body, {
  headers: {
    'Accept-Language': i18n.global.locale,
  },
});

const activate = (token) => axios.post(`/api/1.0/users/token/${token}`);

export { signUp, activate };
