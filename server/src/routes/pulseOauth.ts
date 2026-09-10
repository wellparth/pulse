import { FastifyInstance } from 'fastify';
import { z } from 'zod';

const TokenSchema = z.object({
  grant_type: z.enum(['authorization_code', 'client_credentials']),
  client_id: z.string().min(1),
  client_secret: z.string().min(1),
  code: z.string().optional(),
});

export async function pulseOauthRoutes(fastify: FastifyInstance) {
  // 1. OAuth 2.0 Authorize Consent Endpoint
  fastify.get('/oauth/authorize', async (request, reply) => {
    const { client_id, redirect_uri, state, response_type } = request.query as {
      client_id?: string;
      redirect_uri?: string;
      state?: string;
      response_type?: string;
    };

    if (!client_id || !redirect_uri) {
      return reply.status(400).send({
        error: 'invalid_request',
        error_description: 'Missing client_id or redirect_uri parameters.',
      });
    }

    // Generate authorization code for token exchange
    const authCode = `dp_code_${Math.random().toString(36).substring(2, 12)}`;
    const redirectTarget = new URL(redirect_uri);
    redirectTarget.searchParams.append('code', authCode);
    if (state) redirectTarget.searchParams.append('state', state);

    return reply.redirect(redirectTarget.toString());
  });

  // 2. OAuth 2.0 Token Exchange Endpoint
  fastify.post('/oauth/token', async (request, reply) => {
    const parseResult = TokenSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'invalid_request',
        error_description: 'Invalid token request body parameters.',
      });
    }

    const { client_id, grant_type } = parseResult.data;

    // Issue JWT bearer access token
    const accessToken = fastify.jwt.sign({
      sub: `user_${client_id}`,
      client_id,
      scope: 'read:metrics read:profile',
    }, { expiresIn: '7d' });

    return reply.send({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 604800, // 7 days
      scope: 'read:metrics read:profile',
    });
  });

  // 3. Userinfo Profile Endpoint
  fastify.get('/api/v1/userinfo', async (request, reply) => {
    try {
      await request.jwtVerify();
      const user = request.user as { sub: string; client_id: string; scope: string };

      return reply.send({
        sub: user.sub,
        client_id: user.client_id,
        email: `dev@${user.client_id}.com`,
        scope: user.scope,
      });
    } catch (err) {
      return reply.status(401).send({
        error: 'invalid_token',
        error_description: 'Access token expired or invalid.',
      });
    }
  });
}
