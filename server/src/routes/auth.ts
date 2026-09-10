import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().optional(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function authRoutes(fastify: FastifyInstance) {
  // 1. User Registration Route
  fastify.post('/api/v1/auth/register', async (request, reply) => {
    const parseResult = RegisterSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: 'Invalid registration parameters',
        details: parseResult.error.issues,
      });
    }

    const { email, password, fullName } = parseResult.data;
    const passwordHash = await bcrypt.hash(password, 10);

    const token = fastify.jwt.sign({
      sub: 'demo-user-id',
      email,
    });

    return reply.send({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: 'demo-user-id',
        email,
        fullName: fullName || email.split('@')[0],
        plan: 'free',
      },
    });
  });

  // 2. User Login Route
  fastify.post('/api/v1/auth/login', async (request, reply) => {
    const parseResult = LoginSchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: 'Invalid email or password format',
      });
    }

    const { email } = parseResult.data;

    const token = fastify.jwt.sign({
      sub: 'demo-user-id',
      email,
    });

    return reply.send({
      success: true,
      token,
      user: {
        id: 'demo-user-id',
        email,
        fullName: email.split('@')[0],
        plan: 'free',
      },
    });
  });

  // 3. Current Authenticated User Route
  fastify.get('/api/v1/auth/me', async (request, reply) => {
    try {
      await request.jwtVerify();
      const payload = request.user as { sub: string; email: string };

      return reply.send({
        success: true,
        user: {
          id: payload.sub,
          email: payload.email,
          plan: 'free',
        },
      });
    } catch (err) {
      return reply.status(401).send({
        success: false,
        error: 'Unauthorized or token expired',
      });
    }
  });
}
