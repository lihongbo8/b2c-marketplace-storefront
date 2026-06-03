import { z } from "zod"

export const profilePasswordSchema = z.object({
  newPassword: z.string().nonempty(""),
  confirmPassword: z.string().nonempty("请再次填写新密码"),
})

export type ProfilePasswordFormData = z.infer<typeof profilePasswordSchema>
