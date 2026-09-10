import { FastifyInstance } from 'fastify';

export async function oauthRoutes(fastify: FastifyInstance) {
  // 1. GitHub OAuth Redirect
  fastify.get('/api/v1/auth/github', async (request, reply) => {
    const clientId = process.env.GITHUB_CLIENT_ID || 'Ov23li5EUqvA9ytjhicY';
    const redirectUri = encodeURIComponent(`${process.env.APP_URL || 'http://localhost:4000'}/api/v1/auth/github/callback`);
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,read:user`;

    return reply.redirect(githubAuthUrl);
  });

  // 2. GitHub OAuth Callback
  fastify.get('/api/v1/auth/github/callback', async (request, reply) => {
    const { code } = request.query as { code?: string };

    if (!code) {
      return reply.redirect('http://localhost:3000/dashboard?error=missing_code');
    }

    try {
      const clientId = process.env.GITHUB_CLIENT_ID || 'Ov23li5EUqvA9ytjhicY';
      const clientSecret = process.env.GITHUB_CLIENT_SECRET || '35240109a659b52ad520577fc1f35c992dc70773';

      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      });

      const tokenData = await tokenRes.json();

      if (tokenData.access_token) {
        process.env.GITHUB_TOKEN = tokenData.access_token;
        return reply.redirect('http://localhost:3000/dashboard?connected=github');
      } else {
        return reply.redirect('http://localhost:3000/dashboard?error=token_exchange_failed');
      }
    } catch (error) {
      return reply.redirect('http://localhost:3000/dashboard?error=oauth_failed');
    }
  });

  // 3. Stripe Connect OAuth Redirect
  fastify.get('/api/v1/auth/stripe', async (request, reply) => {
    const clientId = process.env.STRIPE_CLIENT_ID || 'ca_dummy_stripe_client_id';
    const redirectUri = encodeURIComponent(`${process.env.APP_URL || 'http://localhost:4000'}/api/v1/auth/stripe/callback`);
    const stripeAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write&redirect_uri=${redirectUri}`;

    return reply.redirect(stripeAuthUrl);
  });

  // 4. Stripe Connect OAuth Callback
  fastify.get('/api/v1/auth/stripe/callback', async (request, reply) => {
    const { code } = request.query as { code?: string };

    if (!code) {
      return reply.redirect('http://localhost:3000/dashboard?error=missing_code');
    }

    try {
      const clientSecret = process.env.STRIPE_SECRET_KEY || 'dummy_stripe_secret';

      const tokenRes = await fetch('https://connect.stripe.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_secret: clientSecret,
          code,
          grant_type: 'authorization_code',
        }),
      });

      const tokenData = await tokenRes.json();

      if (tokenData.stripe_user_id || tokenData.access_token) {
        process.env.STRIPE_SECRET_KEY = tokenData.access_token || tokenData.stripe_user_id;
        return reply.redirect('http://localhost:3000/dashboard?connected=stripe');
      } else {
        return reply.redirect('http://localhost:3000/dashboard?error=stripe_oauth_failed');
      }
    } catch (error) {
      return reply.redirect('http://localhost:3000/dashboard?error=oauth_failed');
    }
  });
}
