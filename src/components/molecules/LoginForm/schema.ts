import { z } from "zod"

export const loginFormSchema = z.object({
  email: z.string().nonempty("请填写邮箱").email("邮箱格式不正确"),
  password: z.string().nonempty("请填写密码"),
})

export type LoginFormData = z.infer<typeof loginFormSchema>
