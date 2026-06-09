import { z } from "zod"

export const forgotPasswordSchema = z.object({
  email: z.string().nonempty("请填写邮箱").email("邮箱格式不正确"),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
