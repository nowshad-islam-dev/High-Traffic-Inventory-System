import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  PORT: z.string().transform(Number).default(3000),
  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
});

let env: any;

try {
  env = EnvSchema.parse(process.env);
} catch (err) {
  console.error('Error parsing environment variables.');
  process.exit(1);
}

export default env;
