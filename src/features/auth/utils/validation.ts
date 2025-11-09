import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-posta adresi gereklidir")
    .email("Geçerli bir e-posta adresi giriniz"),
  password: z
    .string()
    .min(1, "Şifre gereklidir")
    .min(8, "Şifre en az 8 karakter olmalıdır"),
  rememberMe: z.boolean().optional(),
});

export const loginResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

export const verifyOauthResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

export const refreshTokenResponseSchema = z.object({
  access_token: z.string(),
});

export const signupSchema = z
  .object({
    username: z
      .string()
      .min(1, "Kullanıcı adı gereklidir")
      .min(2, "Kullanıcı adı en az 2 karakter olmalıdır")
      .max(50, "Kullanıcı adı en fazla 50 karakter olabilir"),
    email: z
      .string()
      .min(1, "E-posta adresi gereklidir")
      .email("Geçerli bir e-posta adresi giriniz"),
    password: z
      .string()
      .min(1, "Şifre gereklidir")
      .min(8, "Şifre en az 8 karakter olmalıdır")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir"
      ),
    confirmPassword: z.string().min(1, "Şifre onayı gereklidir"),
    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, "Kullanım koşullarını kabul etmelisiniz"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "E-posta adresi gereklidir")
    .email("Geçerli bir e-posta adresi giriniz"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalıdır")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir"
      ),
    confirmPassword: z.string().min(1, "Şifre onayı gereklidir"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
