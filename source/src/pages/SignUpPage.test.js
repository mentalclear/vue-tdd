import { render, screen, waitFor } from '@testing-library/vue';
// import axios from 'axios';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import SignUpPage from './SignUpPage.vue';
import TheLanguageSelector from '../components/TheLanguageSelector.vue';
import i18n from '../locales/i18n';
import en from '../locales/en.json';
import ru from '../locales/ru.json';

let requestBody;
let counter = 0;
let acceptLanguageHeader;
// Creating msw server here, to intercept rest reqs:
const server = setupServer(
  rest.post('/api/1.0/users', (req, res, ctx) => {
    acceptLanguageHeader = req.headers.get('Accept-Language');
    requestBody = req.body;
    counter += 1;
    return res(ctx.status(200));
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

describe('Sign Up page tests', () => {
  describe('Layout', () => {
    const setupRender = () => render(SignUpPage, {
      global: {
        plugins: [i18n],
      },
    });

    it('Has Sign Up header', () => {
      setupRender();
      const header = screen.queryByRole('heading', { name: 'Sign Up' });
      expect(header).toBeInTheDocument();
    });
    it('Has 3 input fields', () => {
      const { container } = render(SignUpPage, { global: { plugins: [i18n] } });
      const inputCount = container.querySelectorAll('input').length;
      expect(inputCount).toBe(4);
    });
    describe('Username Input', () => {
      it('Has username input', () => {
        setupRender();
        const input = screen.queryByPlaceholderText('User Name');
        expect(input).toBeInTheDocument();
      });
      it('Has username input label', () => {
        setupRender();
        const input = screen.queryByLabelText('User Name:');
        expect(input).toBeInTheDocument();
      });
    });
    describe('E-Mail Input', () => {
      it('Has email input', () => {
        setupRender();
        const input = screen.queryByPlaceholderText('E-Mail');
        expect(input).toBeInTheDocument();
      });
      it('Has email input label', () => {
        setupRender();
        const input = screen.queryByLabelText('User Email:');
        expect(input).toBeInTheDocument();
      });
    });
    describe('Password Input', () => {
      it('Has password input', () => {
        setupRender();
        const input = screen.queryByPlaceholderText('password');
        expect(input).toBeInTheDocument();
      });
      it('Has password input label', () => {
        setupRender();
        const input = screen.queryByLabelText('Password:');
        expect(input).toBeInTheDocument();
      });
      it('Password input has correct type', () => {
        setupRender();
        const input = screen.queryByLabelText('Password:');
        expect(input.type).toBe('password');
      });
    });
    describe('Repeat Password Input', () => {
      it('Has Repeat Password input', () => {
        setupRender();
        const input = screen.queryByPlaceholderText(/repeat password/);
        expect(input).toBeInTheDocument();
      });
      it('Has Repeat Password input label', () => {
        setupRender();
        const input = screen.queryByLabelText('Repeat Password:');
        expect(input).toBeInTheDocument();
      });
      it('Repeat Password input has correct type', () => {
        setupRender();
        const input = screen.queryByLabelText('Repeat Password:');
        expect(input.type).toBe('password');
      });
    });
    describe('Sign Up button', () => {
      it('Has Sign Up Button', () => {
        setupRender();
        const button = screen.queryByRole('button', { name: 'Sign Up' });
        expect(button).toBeInTheDocument();
      });
      it('Sign Up button To be Disabled by default', () => {
        setupRender();
        const button = screen.queryByRole('button', { name: 'Sign Up' });
        expect(button).toBeDisabled();
      });
      it('Enable Sign Up when password fields are match', async () => {
        setupRender();
        const passwordInput = screen.queryByLabelText('Password:');
        const passwordRepeatInput = screen.queryByLabelText('Repeat Password:');
        const button = screen.queryByRole('button', { name: 'Sign Up' });
        await userEvent.type(passwordInput, 'P4ssword');
        await userEvent.type(passwordRepeatInput, 'P4ssword');
        expect(button).toBeEnabled();
      });
    });
  });
  describe('Interactions', () => {
    let button; let passwordInput; let
      passwordRepeatInput; let usernameInput; let emailInput;
    const setup = async () => {
      render(SignUpPage, {
        global: {
          plugins: [i18n],
        },
      });
      usernameInput = screen.queryByLabelText('User Name:');
      emailInput = screen.queryByLabelText('User Email:');
      passwordInput = screen.queryByLabelText('Password:');
      passwordRepeatInput = screen.queryByLabelText('Repeat Password:');
      button = screen.queryByRole('button', { name: 'Sign Up' });
      await userEvent.type(usernameInput, 'user1');
      await userEvent.type(emailInput, 'user1@mail.com');
      await userEvent.type(passwordInput, 'P4ssword');
      await userEvent.type(passwordRepeatInput, 'P4ssword');
    };

    const generateValidationError = (field, message) => rest.post(
      '/api/1.0/users',
      (req, res, ctx) => res(ctx.status(400), ctx.json({
        validationErrors: {
          [field]: message,
        },
      })),
    );
    it('Enable Sign Up when password fields are match', async () => {
      await setup();

      expect(button).toBeEnabled();
    });
    it('Sends username, email & pass to the BE after clicking Sign Up bttn', async () => {
      await setup();

      await userEvent.click(button);
      await screen.findByText('Please check your e-mail to activate your account');

      expect(requestBody).toEqual({
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword',
      });
    });

    it('Disallow clicking Sign Up bttn during ongoing API call', async () => {
      await setup();

      await userEvent.click(button);
      await userEvent.click(button);

      await screen.findByText('Please check your e-mail to activate your account');
      expect(counter).toBe(1);
    });
    it('Displays spinner while API call is in progress', async () => {
      // As it was in the course - permanently fails. Due to race condition.
      // The API call returns too quickly. Added 5ms context delay:
      // ctx.delay(5)
      // passes with no issues now.
      server.use(
        rest.post('/api/1.0/users', (req, res, ctx) => res(ctx.delay(5), ctx.status(200))),
      );
      await setup();

      await userEvent.click(button);
      const spinner = screen.queryByRole('status');
      expect(spinner).toBeInTheDocument();
    });
    it('Doesn\'t display spinner when no API call is in progress', async () => {
      await setup();
      const spinner = screen.queryByRole('status');
      expect(spinner).not.toBeInTheDocument();
    });
    it('Displays account activation info after successful sign in request', async () => {
      await setup();

      await userEvent.click(button);

      const text = await screen.findByText('Please check your e-mail to activate your account');
      expect(text).toBeInTheDocument();
    });
    it('Doesn\'t display account activation msg be4 sigunp request', async () => {
      await setup();
      const text = screen.queryByText('Please check your e-mail to activate your account');
      expect(text).not.toBeInTheDocument();
    });
    it('Doesn\'t display account activation msg for failed sigunp request', async () => {
      server.use(
        rest.post('/api/1.0/users', (req, res, ctx) => res(ctx.status(400), ctx.json({
          validationErrors: {
            username: null,
          },
        }))),
        // rest.post('/api/1.0/users', (req, res, ctx) => res.once(ctx.status(400))),
        // res.once Overrides server setup for one test only.
      );

      await setup();
      await userEvent.click(button);

      const text = screen.queryByText('Please check your e-mail to activate your account');
      expect(text).not.toBeInTheDocument();
    });
    it('Hides sign up form after successful sign in request', async () => {
      await setup();

      const form = screen.queryByTestId('form-sign-up');

      await userEvent.click(button);

      await waitFor(() => {
        expect(form).not.toBeInTheDocument();
      });
    });
    it.each`
      field         | message
      ${'username'} | ${'Username cannot be null'}
      ${'email'}    | ${'E-mail cannot be null'}
      ${'password'} | ${'Password cannot be null'}
    `('Display $message message for field: $field', async ({ field, message }) => {
      server.use(generateValidationError(field, message));

      await setup();
      await userEvent.click(button);

      const text = await screen.findByText(message);
      expect(text).toBeInTheDocument();
    });
    it('Hides spinner after error response received', async () => {
      server.use(generateValidationError('username', 'Username cannot be null'));

      await setup();
      await userEvent.click(button);
      await screen.findByText('Username cannot be null');

      const spinner = screen.queryByRole('status');
      expect(spinner).not.toBeInTheDocument();
    });
    it('Enable the button after response received', async () => {
      server.use(generateValidationError('username', 'Username cannot be null'));

      await setup();
      await userEvent.click(button);
      await screen.findByText('Username cannot be null');

      expect(button).toBeEnabled();
    });
    it('Displays mismatch message for password repeat input', async () => {
      await setup();

      await userEvent.type(passwordInput, 'P4ss1');
      await userEvent.type(passwordRepeatInput, 'P4ss2');
      const text = await screen.findByText('Password mismatch');
      expect(text).toBeInTheDocument();
    });
    it.each`
      field         | message                      | placeholder
      ${'username'} | ${'Username cannot be null'} | ${'User Name'}
      ${'email'}    | ${'E-mail cannot be null'}   | ${'E-Mail'}
      ${'password'} | ${'Password cannot be null'} | ${'password'}
    `('Clear validation error after $field field is updated', async ({ field, message, placeholder }) => {
      server.use(generateValidationError(field, message));

      await setup();
      await userEvent.click(button);
      const text = await screen.findByText(message);
      // Got it to work like this:
      const input = screen.getByPlaceholderText(placeholder);
      await userEvent.type(input, 'udpated');

      expect(text).not.toBeInTheDocument();
    });
  });
  describe('Inernationalization', () => {
    let russianLanguage;
    let englishLanguage;
    let username;
    let email;
    let password;
    let passwordRepeat;
    let button;
    const setupRender = () => {
      // Include custom component
      const app = {
        components: {
          SignUpPage,
          TheLanguageSelector,
        },
        template: `
          <SignUpPage />
          <TheLanguageSelector />
        `,
      };

      render(app, {
        global: {
          plugins: [i18n],
        },
      });
      russianLanguage = screen.queryByTitle('??????????????');
      englishLanguage = screen.queryByTitle('English');
      username = screen.getByLabelText(en.username);
      email = screen.getByLabelText(en.email);
      password = screen.getByLabelText(en.password);
      passwordRepeat = screen.queryByLabelText(en.passwordRepeat);
      button = screen.queryByRole('button', { name: en.signUp });
    };

    it('Initially displays all text in English', async () => {
      setupRender();
      // screen.debug(); debug screen output!
      expect(screen.queryByRole('heading', { name: en.signUp })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: en.signUp })).toBeInTheDocument();
      expect(screen.queryByLabelText(en.username)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.password)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });

    it('Displays all text in Russian after setting that language', async () => {
      setupRender();

      await userEvent.click(russianLanguage);

      expect(screen.queryByRole('heading', { name: ru.signUp })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: ru.signUp })).toBeInTheDocument();
      expect(screen.queryByLabelText(ru.username)).toBeInTheDocument();
      expect(screen.queryByLabelText(ru.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(ru.password)).toBeInTheDocument();
      expect(screen.queryByLabelText(ru.passwordRepeat)).toBeInTheDocument();
    });

    it('Displays all text in English after page is translated to Russian', async () => {
      setupRender();

      await userEvent.click(russianLanguage);
      await userEvent.click(englishLanguage);

      expect(screen.queryByRole('heading', { name: en.signUp })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: en.signUp })).toBeInTheDocument();
      expect(screen.queryByLabelText(en.username)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.email)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.password)).toBeInTheDocument();
      expect(screen.queryByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });

    it('Displays password mismatch validation in Russian', async () => {
      setupRender();

      await userEvent.click(russianLanguage);
      await userEvent.type(password, 'P4ssword');
      await userEvent.type(passwordRepeat, 'N3wP4ss');

      const validation = screen.queryByText(ru.passwordMismatchValidation);
      expect(validation).toBeInTheDocument();
    });

    it('Send accept-language having en to the backend for sign up request', async () => {
      setupRender();
      await userEvent.type(username, 'user300');
      await userEvent.type(email, 'user300@mail.com');
      await userEvent.type(password, 'P4ssword');
      await userEvent.type(passwordRepeat, 'P4ssword');
      await userEvent.click(button);
      await screen.findByText(
        'Please check your e-mail to activate your account',
      );

      expect(acceptLanguageHeader).toBe('en');
    });

    it('Send accept-language having ru to the backend after that one selected', async () => {
      setupRender();

      await userEvent.click(russianLanguage);

      await userEvent.type(username, 'user300');
      await userEvent.type(email, 'user300@mail.com');
      await userEvent.type(password, 'P4ssword');
      await userEvent.type(passwordRepeat, 'P4ssword');
      await userEvent.click(button);
      expect(acceptLanguageHeader).toBe('ru');

      await screen.findByText(
        ru.accountActivationNotification,
      );
    });

    it('Display Account activation message in Russian when Russian is selected', async () => {
      setupRender();

      await userEvent.click(russianLanguage);

      await userEvent.type(username, 'user300');
      await userEvent.type(email, 'user300@mail.com');
      await userEvent.type(password, 'P4ssword');
      await userEvent.type(passwordRepeat, 'P4ssword');
      await userEvent.click(button);

      const accountActivation = await screen.findByText(
        ru.accountActivationNotification,
      );
      expect(accountActivation).toBeInTheDocument();
    });
  });
});
