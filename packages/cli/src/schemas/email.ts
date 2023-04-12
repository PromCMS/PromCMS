import { z } from 'zod';

export const emailSchema = z.string().email('Email is not a valid email');
