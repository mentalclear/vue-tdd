import { render, screen, waitFor } from '@testing-library/vue';
// import axios from 'axios';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import SignUpPage from './SignUpPage.vue';
import '@testing-library/jest-dom';

describe('Sign Up page tests', () => {
  describe('Layout', () => {
    it('Has Sign Up header', () => {
      render(SignUpPage);
      const header = screen.queryByRole('heading', { name: 'Sign Up' });
      expect(header).toBeInTheDocument();
    });
    it('Has 3 input fields', () => {
      const { container } = render(SignUpPage);
      const inputCount = container.querySelectorAll('input').length;
      expect(inputCount).toBe(4);
    });
    describe('Username Input', () => {
      it('Has username input', () => {
        render(SignUpPage);
        const input = screen.queryByPlaceholderText('User Name');
        expect(input).toBeInTheDocument();
      });
      it('Has username input label', () => {
        render(SignUpPage);
        const input = screen.queryByLabelText('User Name:');
        expect(input).toBeInTheDocument();
      });
    });
    describe('E-Mail Input', () => {
      it('Has email input', () => {
        render(SignUpPage);
        const input = screen.queryByPlaceholderText('E-Mail');
        expect(input).toBeInTheDocument();
      });
      it('Has email input label', () => {
        render(SignUpPage);
        const input = screen.queryByLabelText('User Email:');
        expect(input).toBeInTheDocument();
      });
    });
    describe('Password Input', () => {
      it('Has password input', () => {
        render(SignUpPage);
        const input = screen.queryByPlaceholderText('password');
        expect(input).toBeInTheDocument();
      });
      it('Has password input label', () => {
        render(SignUpPage);
        const input = screen.queryByLabelText('Password:');
        expect(input).toBeInTheDocument();
      });
      it('Password input has correct type', () => {
        render(SignUpPage);
        const input = screen.queryByLabelText('Password:');
        expect(input.type).toBe('password');
      });
    });
    describe('Repeat Password Input', () => {
      it('Has Repeat Password input', () => {
        render(SignUpPage);
        const input = screen.queryByPlaceholderText(/repeat password/);
        expect(input).toBeInTheDocument();
      });
      it('Has Repeat Password input label', () => {
        render(SignUpPage);
        const input = screen.queryByLabelText('Repeat Password:');
        expect(input).toBeInTheDocument();
      });
      it('Repeat Password input has correct type', () => {
        render(SignUpPage);
        const input = screen.queryByLabelText('Repeat Password:');
        expect(input.type).toBe('password');
      });
    });
    describe('Sign Up button', () => {
      it('Has Sign Up Button', () => {
        render(SignUpPage);
        const button = screen.queryByRole('button', { name: 'Sign Up' });
        expect(button).toBeInTheDocument();
      });
      it('Sign Up button To be Disabled by default', () => {
        render(SignUpPage);
        const button = screen.queryByRole('button', { name: 'Sign Up' });
        expect(button).toBeDisabled();
      });
      it('Enable Sign Up when password fields are match', async () => {
        render(SignUpPage);
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
    let requestBody;
    let counter = 0;
    // Creating msw server here, to intercept rest reqs:
    const server = setupServer(
      rest.post('/api/1.0/users', (req, res, ctx) => {
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

    let button;
    const setup = async () => {
      render(SignUpPage);
      const usernameInput = screen.queryByLabelText('User Name:');
      const emailInput = screen.queryByLabelText('User Email:');
      const passwordInput = screen.queryByLabelText('Password:');
      const passwordRepeatInput = screen.queryByLabelText('Repeat Password:');
      button = screen.queryByRole('button', { name: 'Sign Up' });
      await userEvent.type(usernameInput, 'user1');
      await userEvent.type(emailInput, 'user1@mail.com');
      await userEvent.type(passwordInput, 'P4ssword');
      await userEvent.type(passwordRepeatInput, 'P4ssword');
    };

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
    it.skip('Displays spinner while API call is in progress', async () => {
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
    it('Display validation message for username', async () => {
      server.use(
        rest.post('/api/1.0/users', (req, res, ctx) => res(ctx.status(400), ctx.json({
          validationErrors: {
            username: 'Username cannot be null',
          },
        }))),
      );

      await setup();
      await userEvent.click(button);

      const text = await screen.findByText('Username cannot be null');
      expect(text).toBeInTheDocument();
    });
  });
});
