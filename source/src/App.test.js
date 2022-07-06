import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import App from './App.vue';
import i18n from './locales/i18n';
import router from './routes/router';

const server = setupServer(
  rest.post('/api/1.0/users/token/:token', (req, res, ctx) => res(ctx.status(200))),
  rest.get('/api/1.0/users', (req, res, ctx) => res(ctx.status(200), ctx.json({
    content: [
      {
        id: 1,
        username: 'user-in-list',
        email: 'user-in-list@mail.com',
        image: null,
      },
    ],
    page: 0,
    size: 0,
    totalPages: 0,
  }))),
  rest.get('/api/1.0/users/:id', (req, res, ctx) => {
    const id = Number.parseInt(req.params.id, 10);

    return res(ctx.status(200), ctx.json({
      id,
      username: `user${id}`,
      email: `user${id}@mail.com`,
      image: null,
    }));
  }),
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

const setupPath = async (path) => {
  render(App, {
    global: {
      plugins: [i18n, router],
    },
  });
  router.replace(path);
  await router.isReady();
};

describe('Routing', () => {
  it.each`
  path                 | pageTestId
  ${'/'}               | ${'home-page'}
  ${'/signup'}         | ${'signup-page'} 
  ${'/login'}          | ${'login-page'} 
  ${'/user/1'}         | ${'user-page'}
  ${'/user/2'}         | ${'user-page'}
  ${'/activate/1234'}  | ${'activation-page'}
  ${'/activate/5678'}  | ${'activation-page'}
  `('Display $pageTestId at path: $path', async ({ path, pageTestId }) => {
    await setupPath(path);

    const page = screen.queryByTestId(pageTestId);
    expect(page).toBeInTheDocument();
  });

  it.each`
  path          | pageTestId
  ${'/'}        | ${'signup-page'}
  ${'/'}        | ${'login-page'} 
  ${'/'}        | ${'user-page'}
  ${'/'}        | ${'activation-page'}
  ${'/signup'}  | ${'home-page'} 
  ${'/signup'}  | ${'login-page'} 
  ${'/signup'}  | ${'user-page'}
  ${'/signup'}  | ${'activation-page'} 
  ${'/login'}   | ${'home-page'}
  ${'/login'}   | ${'signup-page'}
  ${'/login'}   | ${'user-page'}
  ${'/login'}   | ${'activation-page'}
  ${'/user/1'}  | ${'signup-page'}
  ${'/user/1'}  | ${'login-page'} 
  ${'/user/1'}  | ${'home-page'}
  ${'/user/1'}  | ${'activation-page'}
  ${'/activate/123'}  | ${'signup-page'}
  ${'/activate/123'}  | ${'login-page'} 
  ${'/activate/123'}  | ${'home-page'} 
  ${'/activate/123'}  | ${'user-page'}
  `('Will not display $pageTestId page at path: $path', async ({ path, pageTestId }) => {
    await setupPath(path);

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
    const page = await screen.findByTestId(visiblePage);
    expect(page).toBeInTheDocument();
  });
  it('Display home page after clicking logo', async () => {
    setupPath('/login');

    const image = screen.queryByAltText('Hoaxify logo');
    await userEvent.click(image);
    const page = await screen.findByTestId('home-page');
    expect(page).toBeInTheDocument();
  });
  it('Navigate to user page when user link is clicked', async () => {
    await setupPath('/');
    const user = await screen.findByText('user-in-list');
    await userEvent.click(user);
    const page = await screen.findByTestId('user-page');
    expect(page).toBeInTheDocument();
  });
});
describe('Login', () => {
  it('Redirect to home page after successful login', async () => {
    server.use(
      rest.post('/api/1.0/auth', (req, res, ctx) => res(ctx.status(200), ctx.json({
        username: 'user5',
      }))),
    );
    await setupPath('/login');
    await userEvent.type(screen.queryByLabelText('User Email:'), 'user5@mail.com');
    await userEvent.type(screen.queryByLabelText('Password:'), 'P4ssword');
    await userEvent.click(screen.queryByRole('button', { name: 'Login' }));
    const page = await screen.findByTestId('home-page');
    expect(page).toBeInTheDocument();
  });
});
