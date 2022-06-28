import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import App from './App.vue';
import i18n from './locales/i18n';

const setupPath = (path) => {
  window.history.pushState({}, '', path);
  render(App, {
    global: {
      plugins: [i18n],
    },
  });
};

describe('Routing', () => {
  it.each`
  path          | pageTestId
  ${'/'}        | ${'home-page'}
  ${'/signup'}  | ${'signup-page'} 
  ${'/login'}   | ${'login-page'} 
  ${'/user/1'}  | ${'user-page'}
  ${'/user/2'}  | ${'user-page'}
  `('Display $pageTestId at path: $path', ({ path, pageTestId }) => {
    setupPath(path);

    const page = screen.queryByTestId(pageTestId);
    expect(page).toBeInTheDocument();
  });

  it.each`
  path          | pageTestId
  ${'/'}        | ${'signup-page'}
  ${'/'}        | ${'login-page'} 
  ${'/'}        | ${'user-page'}
  ${'/signup'}  | ${'home-page'} 
  ${'/signup'}  | ${'login-page'} 
  ${'/signup'}  | ${'user-page'} 
  ${'/login'}   | ${'home-page'}
  ${'/login'}   | ${'signup-page'}
  ${'/login'}   | ${'user-page'}
  ${'/user/1'}  | ${'signup-page'}
  ${'/user/1'}  | ${'login-page'} 
  ${'/user/1'}  | ${'home-page'}
  `('Will not display $pageTestId page at path: $path', ({ path, pageTestId }) => {
    setupPath(path);

    const page = screen.queryByTestId(pageTestId);
    expect(page).not.toBeInTheDocument();
  });

  it.each`
  targetPage
  ${'Home'}
  ${'Sign Up'}
  ${'LogIn'}
  `('Has link to $targetPage in the NavBar', ({ targetPage }) => {
    setupPath('/');

    const link = screen.queryByRole('link', { name: targetPage });
    expect(link).toBeInTheDocument();
  });
  it.each`
  initialPath | clickingTo   | visiblePage
  ${'/'}      | ${'Sign Up'} | ${'signup-page'} 
  ${'/signup'}| ${'Home'}    | ${'home-page'} 
  ${'/'}      | ${'LogIn'}   | ${'login-page'} 
  `('Display $visiblePage page after clicking $clickingTo link', async (
    { initialPath, clickingTo, visiblePage },
  ) => {
    setupPath(initialPath);
    const link = screen.queryByRole('link', { name: clickingTo });

    await userEvent.click(link);
    const page = screen.queryByTestId(visiblePage);
    expect(page).toBeInTheDocument();
  });
});
