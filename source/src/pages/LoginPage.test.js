import {
  render, screen, waitFor, waitForElementToBeRemoved,
} from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import i18n from '../locales/i18n';
import LoginPage from './LoginPage.vue';

let requestBody; let counter = 0;
const server = setupServer(
  rest.post('/api/1.0/auth', (req, res, ctx) => {
    requestBody = req.body;
    counter += 1;
    return res(ctx.delay(100), ctx.status(401));
  }),
);

beforeAll(() => {
  server.listen();
});
beforeEach(() => {
  counter = 0;
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

let emailInput; let
  passwordInput; let button;
const setupRender = async () => {
  render(LoginPage, {
    global: {
      plugins: [i18n],
    },
  });
  emailInput = screen.queryByPlaceholderText('E-Mail');
  passwordInput = screen.queryByPlaceholderText('password');
  button = screen.queryByRole('button', { name: 'LogIn' });
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
      expect(button).toBeInTheDocument();
    });
    it('LogIn button To be Disabled by default', async () => {
      await setupRender();
      expect(button).toBeDisabled();
    });
  });
  describe('Interactions', () => {
    const setupFilled = async () => {
      await setupRender();
      await userEvent.type(emailInput, 'user100@gmail.com');
      await userEvent.type(passwordInput, 'P4ssword');
    };

    it('Enable LogIn button when email and password are given', async () => {
      await setupFilled();
      expect(button).toBeEnabled();
    });
    it('Display spinner after clicking the button', async () => {
      await setupFilled();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      await userEvent.click(button);
      expect(screen.queryByRole('status')).toBeInTheDocument();
    });
    it('Hide spinner after filed API call', async () => {
      await setupFilled();
      await userEvent.click(button);
      const spinner = screen.queryByRole('status');
      await waitFor(() => {
        expect(spinner).not.toBeInTheDocument();
      });
    });
    it('Send email and password to the backend after clicking the button', async () => {
      await setupFilled();
      await userEvent.click(button);
      const spinner = screen.queryByRole('status');
      await waitForElementToBeRemoved(spinner);
      expect(requestBody).toEqual({
        email: 'user100@gmail.com',
        password: 'P4ssword',
      });
    });
    it('Disable the button when there is an active API call', async () => {
      await setupFilled();
      await userEvent.click(button);
      await userEvent.click(button);
      const spinner = screen.queryByRole('status');

      await waitForElementToBeRemoved(spinner);
      expect(counter).toBe(1);
    });
  });
});
