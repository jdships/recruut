import { z } from 'zod';

export const logInSchema = z.object({
  email: z
    .string({
      invalid_type_error: 'Email must be a string.'
    })
    .trim()
    .min(1, 'Email is required.')
    .max(255, 'Maximum 255 characters allowed.')
    .email('Enter a valid email address.'),
  password: z
    .string({
      required_error: 'Password is required.',
      invalid_type_error: 'Password must be a string.'
    })
    .min(1, 'Password is required.')
    .max(72, 'Maximum 72 characters allowed.')
});

export type LoginSchema = z.infer<typeof logInSchema>;

export const submitTotpCodeSchema = z.object({
  token: z
    .string({
      invalid_type_error: 'Token must be a string.'
    })
    .trim()
    .min(1, 'Token is required.')
    .max(255, 'Maximum 255 characters allowed.'),
  expiry: z
    .string({
      invalid_type_error: 'Expiry must be a string.'
    })
    .trim()
    .min(1, 'Expiry is required.')
    .max(255, 'Maximum 255 characters allowed.'),
  totpCode: z
    .string({
      required_error: 'Code is required.',
      invalid_type_error: 'Code consists of 6 digits.'
    })
    .trim()
    .max(6, { message: '' })
});

export type SubmitTotpCodeSchema = z.infer<typeof submitTotpCodeSchema>;

export const submitRecoveryCodeSchema = z.object({
  token: z
    .string({
      invalid_type_error: 'Token must be a string.'
    })
    .trim()
    .min(1, 'Token is required.')
    .max(255, 'Maximum 255 characters allowed.'),
  expiry: z
    .string({
      invalid_type_error: 'Expiry must be a string.'
    })
    .trim()
    .min(1, 'Expiry is required.')
    .max(255, 'Maximum 255 characters allowed.'),
  recoveryCode: z
    .string({
      required_error: 'Recovery code is required.',
      invalid_type_error: 'Recovery code must be a string.'
    })
    .trim()
    .min(1, 'Recovery code is required.')
    .max(11, 'Maximum 11 characters allowed.')
});

export type SubmitRecoveryCodeSchema = z.infer<typeof submitRecoveryCodeSchema>;
