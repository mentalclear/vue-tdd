import { render, screen } from '@testing-library/vue';
import axios from 'axios';
import userEvent from '@testing-library/user-event';
import SignUpPage from './SignUpPage.vue';
import '@testing-library/jest-dom';

describe('Sign Up page', () => {
  describe('Interactions', () => {
    it('Sends username, email & pass to the BE after clicking Sign Up bttn with axios', async () => {
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
      const mockFn = jest.fn(); // needed with both

      // Mocking axios.post here:
      axios.post = mockFn;

      // Mocking fetch()  // !!! Requires whatwg-fetch package !!!
      // window.fetch = mockFn;

      await userEvent.click(button); // waiting for the button click, axios, fetch

      const firstCall = mockFn.mock.calls[0]; // Works with both axios and fetch

      const body = firstCall[1]; // Represents 'data?' field of axios.post()
      // const body = JSON.parse(firstCall[1].body); // An approach for fetch
      expect(body).toEqual({ // variation for axios and fetch
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword',
      });
    });
  });
});
