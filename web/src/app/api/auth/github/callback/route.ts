import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/dashboard?error=missing_code', request.url));
  }

  const clientId = process.env.GITHUB_CLIENT_ID || 'Ov23li5EUqvA9ytjhicY';
  const clientSecret = process.env.GITHUB_CLIENT_SECRET || '35240109a659b52ad520577fc1f35c992dc70773';

  try {
    // 1. Exchange OAuth code for GitHub Access Token
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

    if (!tokenData.access_token) {
      return NextResponse.redirect(new URL('/dashboard?error=token_exchange_failed', request.url));
    }

    const accessToken = tokenData.access_token;

    // 2. Fetch authenticated GitHub user details from GitHub REST API
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken}`,
        'User-Agent': 'DailyPulse-App',
      },
    });

    const ghUser = await userRes.json();

    // 3. Notify Fastify backend of newly connected GitHub token
    await fetch('http://localhost:4000/api/v1/integrations/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'github',
        apiKey: accessToken,
        meta: { username: ghUser.login, avatar: ghUser.avatar_url },
      }),
    }).catch(() => null);

    return NextResponse.redirect(new URL(`/dashboard?connected=github&user=${ghUser.login}`, request.url));
  } catch (error) {
    console.error('GitHub OAuth handler error:', error);
    return NextResponse.redirect(new URL('/dashboard?error=oauth_error', request.url));
  }
}
