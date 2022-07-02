import { render, screen, waitFor } from '@testing-library/vue';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import UserPage from './UserPage.vue';

const server = setupServer(
  rest.get('/api/1.0/users/:id', (req, res, ctx) => res(ctx.status(200), ctx.json({
    id: 1,
    username: 'user1',
    email: 'user1@mail.com',
    image: null,
  }))),
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
  it('Dislay username when user is found', async () => {
    render(UserPage, {
      global: {
        mocks: {
          $route: { params: { id: 1 } },
        },
      },
    });

    await waitFor(() => {
      expect(screen.queryByText('user1')).toBeInTheDocument();
    });
  });
});
