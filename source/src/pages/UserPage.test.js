import { render, screen, waitFor } from '@testing-library/vue';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import UserPage from './UserPage.vue';

const server = setupServer(

  rest.get('/api/1.0/users/:id', (req, res, ctx) => {
    if (req.params.id === '1') {
      return res(ctx.status(200), ctx.json({
        id: 1,
        username: 'user1',
        email: 'user1@mail.com',
        image: null,
      }));
    }
    return res(ctx.status(404), ctx.json({
      message: 'User not found',
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

describe('User Page', () => {
  const setupUserPage = (id = 1) => {
    render(UserPage, {
      global: {
        mocks: {
          $route: { params: { id } },
        },
      },
    });
  };
  it('Dislay username when user is found', async () => {
    await waitFor(() => {
      setupUserPage();

      expect(screen.queryByText('user1')).toBeInTheDocument();
    });
  });
  it('Disply spinner while API call is in progress', () => {
    setupUserPage();

    const spinner = screen.queryByRole('status');
    expect(spinner).toBeInTheDocument();
  });
  it('Disply error message from BE when user is not found', async () => {
    setupUserPage(100);

    await waitFor(() => {
      expect(screen.queryByText('User not found')).toBeInTheDocument();
    });
  });
});
