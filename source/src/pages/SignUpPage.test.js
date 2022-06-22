import { render, screen } from '@testing-library/vue';
import SignUpPage from './SignUpPage.vue';
import '@testing-library/jest-dom';

it('Has Sign Up header', () => {
  render(SignUpPage);
  const header = screen.queryByRole('heading', { name: 'Sign Up' });
  expect(header).toBeInTheDocument();
});
