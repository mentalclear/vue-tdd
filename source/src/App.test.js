import { render, screen } from '@testing-library/vue';
import App from './App.vue';
import '@testing-library/jest-dom';
import i18n from './locales/i18n';

describe('Routing', () => {
  it('Displays home page at /', () => {
    render(App, {
      global: {
        plugins: [i18n],
      },
    });

    const page = screen.queryByTestId('home-page');
    expect(page).toBeInTheDocument();
  });

  it('Will not display Sign Up page at /', () => {
    render(App, {
      global: {
        plugins: [i18n],
      },
    });

    const page = screen.queryByTestId('signup-page');
    expect(page).not.toBeInTheDocument();
  });

  it('Will display Sign Up page at /signup', () => {
    window.history.pushState({}, '', '/signup');
    render(App, {
      global: {
        plugins: [i18n],
      },
    });

    const page = screen.queryByTestId('signup-page');
    expect(page).toBeInTheDocument();
  });

  it('Will display Home Page at /signup', () => {
    window.history.pushState({}, '', '/signup');
    render(App, {
      global: {
        plugins: [i18n],
      },
    });

    const page = screen.queryByTestId('home-page');
    expect(page).not.toBeInTheDocument();
  });
});
