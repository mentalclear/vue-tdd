import { render, screen } from '@testing-library/vue';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import AccountActivationPage from './AccountActivationPage.vue';

const server = setupServer();

beforeAll(() => {
  server.listen();
});
beforeEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe('Account activation', () => {
  const setupRender = (token) => {
    render(AccountActivationPage, {
      global: {
        mocks: {
          $route: {
            params: {
              token,
            },
          },
        },
      },
    });
  };

  let counter;
  beforeEach(() => {
    counter = 0;
    server.use(
      rest.post('/api/1.0/users/token/:token', (req, res, ctx) => {
        counter += 1;
        return res(ctx.status(200));
      }),
    );
  });

  it('Displays activation page', async () => {
    setupRender('1234');
    const message = await screen.findByText('Account is activated');
    expect(message).toBeInTheDocument();
  });
  it('Send activation request to the backend', async () => {
    setupRender('1234');
    await screen.findByText('Account is activated');
    expect(counter).toBe(1);
  });
});
