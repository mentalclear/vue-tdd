import {
  render, screen, waitFor, waitForElementToBeRemoved,
} from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import TheLanguageSelector from '../components/TheLanguageSelector.vue';
import i18n from '../locales/i18n';
import en from '../locales/en.json';
import ru from '../locales/ru.json';
import LoginPage from './LoginPage.vue';

let requestBody; let counter = 0; let acceptLanguageHeader;
const server = setupServer(
  rest.post('/api/1.0/auth', (req, res, ctx) => {
    requestBody = req.body;
    counter += 1;
    acceptLanguageHeader = req.headers.get('Accept-Language');
    return res(ctx.delay(100), ctx.status(401), ctx.json({
      message: 'Incorrect credentials',
    }));
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
  emailInput = screen.queryByLabelText('User Email:');
  passwordInput = screen.queryByLabelText('Password:');
  button = screen.queryByRole('button', { name: 'Login' });
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
      const input = screen.queryByLabelText('User Email:');
      expect(input).toBeInTheDocument();
    });
    it('Has password input', async () => {
      await setupRender();
      const input = screen.queryByLabelText('Password:');
      expect(input).toBeInTheDocument();
    });
    it('Password input has correct type', async () => {
      await setupRender();
      const input = screen.queryByLabelText('Password:');
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
    it('Display authentication fail message', async () => {
      await setupFilled();
      await userEvent.click(button);
      const errorMessage = await screen.findByText('Incorrect credentials');
      expect(errorMessage).toBeInTheDocument();
    });
    it('Clear authentication fail message for changed email', async () => {
      await setupFilled();
      await userEvent.click(button);
      const errorMessage = await screen.findByText('Incorrect credentials');
      await userEvent.type(emailInput, 'new@mail.com');
      expect(errorMessage).not.toBeInTheDocument();
    });
    it('Clear authentication fail message for changed password', async () => {
      await setupFilled();
      await userEvent.click(button);
      const errorMessage = await screen.findByText('Incorrect credentials');
      await userEvent.type(passwordInput, 'newP4ssword');
      expect(errorMessage).not.toBeInTheDocument();
    });
  });
  describe('Inernationalization', () => {
    let russianLanguage;
    const setupInternRender = () => {
      // Include custom component
      const app = {
        components: {
          LoginPage,
          TheLanguageSelector,
        },
        template: `
          <LoginPage />
          <TheLanguageSelector />
        `,
      };

      render(app, {
        global: {
          plugins: [i18n],
        },
      });
      russianLanguage = screen.queryByTitle('Русский');
    };
    it('Initially displays all text in English', async () => {
      setupInternRender();
      expect(screen.queryByRole('heading', { name: en.login })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: en.login })).toBeInTheDocument();
      expect(screen.queryByLabelText(en.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.password)).toBeInTheDocument();
    });
    it('Display all text in Russian after language is changed', async () => {
      setupInternRender();
      await userEvent.click(russianLanguage);
      expect(screen.queryByRole('heading', { name: ru.login })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: ru.login })).toBeInTheDocument();
      expect(screen.queryByLabelText(ru.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(ru.password)).toBeInTheDocument();
    });
    it('Send accept-language header as ru in login request', async () => {
      setupInternRender();
      await userEvent.click(russianLanguage);
      const emailInputNew = screen.queryByLabelText(ru.email);
      const passwordInputNew = screen.queryByLabelText(ru.password);
      await userEvent.type(emailInputNew, 'user300@mail.com');
      await userEvent.type(passwordInputNew, 'P4ssword');
      const loginButton = screen.queryByRole('button', { name: ru.login });
      await userEvent.click(loginButton);
      const spinner = screen.queryByRole('status');
      await waitForElementToBeRemoved(spinner);
      expect(acceptLanguageHeader).toBe('ru');
    });
  });
});
