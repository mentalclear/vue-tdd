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
        if (req.params.token === '5678') {
          return res(
            ctx.status(400),
            ctx.json({
              message: 'Activation failure',
            }),
          );
        }
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
  it('Displays activation failure message when token is incorrect', async () => {
    setupRender('5678');
    const message = await screen.findByText('Activation failure');
    expect(message).toBeInTheDocument();
  });
  it('Displays spinner during the activation api call', async () => {
    setupRender('1234');
    const spinner = await screen.findByRole('status');
    expect(spinner).toBeInTheDocument();
    await screen.findByText('Account is activated');
    expect(spinner).not.toBeInTheDocument();
  });
});
