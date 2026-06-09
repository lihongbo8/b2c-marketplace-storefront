import { z } from "zod"

export const profileDetailsSchema = z.object({
  firstName: z.string().nonempty("请填写名"),
  lastName: z.string().nonempty("请填写姓"),
  phone: z.string().nonempty("请填写电话"),
  email: z.string().nonempty("请填写邮箱"),
})

export type ProfileDetailsFormData = z.infer<typeof profileDetailsSchema>
