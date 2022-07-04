import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import i18n from '../locales/i18n';
import LoginPage from './LoginPage.vue';

// Creating msw server here, to intercept rest reqs:
const server = setupServer(
  rest.post('/api/1.0/auth', (req, res, ctx) => res(ctx.status(401))),
);

beforeAll(() => {
  server.listen();
});
beforeEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

const setupRender = async () => {
  render(LoginPage, {
    global: {
      plugins: [i18n],
    },
  });
};

describe('Login Page', () => {
  describe('Layout', () => {
    it('Has Login Header ', async () => {
      await setupRender();
      const header = screen.queryByRole('heading', { name: 'Login' });
      expect(header).toBeInTheDocument();
    });
    it('Has email input', async () => {
      await setupRender();
      const input = screen.queryByPlaceholderText('E-Mail');
      expect(input).toBeInTheDocument();
    });
    it('Has password input', async () => {
      await setupRender();
      const input = screen.queryByPlaceholderText('password');
      expect(input).toBeInTheDocument();
    });
    it('Password input has correct type', async () => {
      await setupRender();
      const input = screen.queryByLabelText('Password');
      expect(input.type).toBe('password');
    });
    it('Has LogIn Button', async () => {
      await setupRender();
      const button = screen.queryByRole('button', { name: 'LogIn' });
      expect(button).toBeInTheDocument();
    });
    it('LogIn button To be Disabled by default', async () => {
      await setupRender();
      const button = screen.queryByRole('button', { name: 'LogIn' });
      expect(button).toBeDisabled();
    });
  });
  describe('Interactions', () => {
    it('Enable LogIn button when email and password are given', async () => {
      await setupRender();
      const emailInput = screen.queryByPlaceholderText('E-Mail');
      const passwordInput = screen.queryByPlaceholderText('password');
      await userEvent.type(emailInput, 'user100@gmail.com');
      await userEvent.type(passwordInput, 'P4ssword');
      const button = screen.queryByRole('button', { name: 'LogIn' });
      expect(button).toBeEnabled();
    });
  });
});
