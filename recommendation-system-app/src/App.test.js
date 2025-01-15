import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const server = setupServer(
  // Example mock for the token endpoint
  rest.post('http://localhost:8000/token/', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        access_token: 'mocked_token',
        token_type: 'bearer',
      })
    );
  }),

  // Mocked shows endpoint
  rest.get('http://localhost:8000/shows/', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, title: 'Show 1', description: 'This is Show 1' },
        { id: 2, title: 'Show 2', description: 'This is Show 2' },
      ])
    );
  })
);
