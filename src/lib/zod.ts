import { object, string, refine } from 'zod';

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;

export const signInSchema = object({
  email: string('Email is required').min(1, 'Email is required').email('Invalid email'),
  password: string('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be less than 32 characters')
    .regex(
      passwordRegex,
      'Password must include uppercase, lowercase, number, and special character',
    ),
});

export const signUpSchema = object({
  name: string('Name is required').min(1, 'Name is required'),
  email: string('Email is required').min(1, 'Email is required').email('Invalid email'),
  password: string('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(32, 'Password must be less than 32 characters')
    .regex(
      passwordRegex,
      'Password must include uppercase, lowercase, number, and special character',
    ),
  confirmPassword: string('Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
