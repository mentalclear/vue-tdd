import { render, screen } from '@testing-library/vue';
// import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import userEvent from '@testing-library/user-event';
import UserList from './UserList.vue';

const users = [
  {
    id: 1, username: 'user1', email: 'user1@mail.com', image: null,
  },
  {
    id: 2, username: 'user2', email: 'user2@mail.com', image: null,
  },
  {
    id: 3, username: 'user3', email: 'user3@mail.com', image: null,
  },
  {
    id: 4, username: 'user4', email: 'user4@mail.com', image: null,
  },
  {
    id: 5, username: 'user5', email: 'user5@mail.com', image: null,
  },
  {
    id: 6, username: 'user6', email: 'user6@mail.com', image: null,
  },
  {
    id: 7, username: 'user7', email: 'user7@mail.com', image: null,
  },
];

const getPage = (page, size) => {
  const start = page * size;
  const end = start + size;
  const totalPages = Math.ceil(users.length / size);
  return {
    content: users.slice(start, end),
    page,
    size,
    totalPages,
  };
};

// Creating msw server here, to intercept rest reqs:
const server = setupServer(
  rest.get('/api/1.0/users', (req, res, ctx) => {
    let page = Number.parseInt(req.url.searchParams.get('page'), 10);
    let size = Number.parseInt(req.url.searchParams.get('size'), 10);
    if (Number.isNaN(page) || Number.isNaN(size)) {
      page = 0;
      size = 3;
    }

    return res(ctx.status(200), ctx.json(getPage(page, size)));
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

describe('User List', () => {
  it('Display 3 users in the list', async () => {
    render(UserList);
    const allUsers = await screen.findAllByText(/user/);

    expect(allUsers.length).toBe(3);
  });
  it('Display next page link', async () => {
    render(UserList);
    await screen.findByText('user1');
    const nextLink = screen.queryByText('next >');
    expect(nextLink).toBeInTheDocument();
  });
  it('Display next page after clicking next link', async () => {
    render(UserList);
    await screen.findByText('user1');
    const nextLink = screen.queryByText('next >');
    await userEvent.click(nextLink);
    const firstUserOnPage2 = await screen.findByText('user4');
    expect(firstUserOnPage2).toBeInTheDocument();
  });
  it('Hide next link at the last page', async () => {
    render(UserList);
    screen.queryByText('next >');
    await screen.findByText('user1');
    await userEvent.click(screen.queryByText('next >'));
    await screen.findByText('user4');
    await userEvent.click(screen.queryByText('next >'));
    await screen.findByText('user7');
    expect(screen.queryByText('next >')).not.toBeInTheDocument();
  });
  it('Doesn\'t display previous page link in the first page', async () => {
    render(UserList);
    screen.queryByText('next >');
    await screen.findByText('user1');
    expect(screen.queryByText('< previous')).not.toBeInTheDocument();
  });
  it('Display previous page link in the page 2', async () => {
    render(UserList);
    screen.queryByText('next >');
    await screen.findByText('user1');
    await userEvent.click(screen.queryByText('next >'));
    await screen.findByText('user4');
    expect(screen.queryByText('< previous')).toBeInTheDocument();
  });
  it('Display previous page lafter previous link clicked', async () => {
    render(UserList);
    screen.queryByText('next >');
    await screen.findByText('user1');
    await userEvent.click(screen.queryByText('next >'));
    await screen.findByText('user4');
    await userEvent.click(screen.queryByText('< previous'));
    const firstUserOnPage1 = await screen.findByText('user1');
    expect(firstUserOnPage1).toBeInTheDocument();
  });
});
