import { render, screen } from '@testing-library/vue';
// import axios from 'axios';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import SignUpPage from './SignUpPage.vue';
import 'whatwg-fetch';
import '@testing-library/jest-dom';

describe('Sign Up page', () => {
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
    });
  });
  describe('Interactions', () => {
    it('Enable Sign Up when password fields are match', async () => {
      render(SignUpPage);
      const passwordInput = screen.queryByLabelText('Password:');
      const passwordRepeatInput = screen.queryByLabelText('Repeat Password:');
      const button = screen.queryByRole('button', { name: 'Sign Up' });
      await userEvent.type(passwordInput, 'P4ssword');
      await userEvent.type(passwordRepeatInput, 'P4ssword');
      expect(button).toBeEnabled();
    });
    it('Sends username, email & pass to the BE after clicking Sign Up bttn', async () => {
      let reqestBody;

      // Creating msw server here, to intercept rest reqs:
      const server = setupServer(
        rest.post('/api/1.0/users', (req, res, ctx) => {
          reqestBody = res.body;
          return res(ctx.status(200));
        }),
      );
      server.listen();

      render(SignUpPage);
      const usernameInput = screen.queryByLabelText('User Name:');
      const emailInput = screen.queryByLabelText('User Email:');
      const passwordInput = screen.queryByLabelText('Password:');
      const passwordRepeatInput = screen.queryByLabelText('Repeat Password:');
      const button = screen.queryByRole('button', { name: 'Sign Up' });
      await userEvent.type(usernameInput, 'user1');
      await userEvent.type(emailInput, 'user1@mail.com');
      await userEvent.type(passwordInput, 'P4ssword');
      await userEvent.type(passwordRepeatInput, 'P4ssword');

      // Mock axios and fetch:
      // const mockFn = jest.fn(); // needed with both

      // Mocking axios.post here:
      // axios.post = mockFn;

      // Mocking fetch()
      // window.fetch = mockFn;

      // await userEvent.click(button); // waiting for the button click

      // const firstCall = mockFn.mock.calls[0]; // Works with both axios and fetch

      // const body = firstCall[1]; // Represents 'data?' field of axios.post()
      // const body = JSON.parse(firstCall[1].body); // An approach for fetch

      await userEvent.click(button); // waiting for the button click

      // expect(body).toEqual({ // variation for axios and fetch
      expect(reqestBody).toEqual({
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword',
      });
    });
  });
});
