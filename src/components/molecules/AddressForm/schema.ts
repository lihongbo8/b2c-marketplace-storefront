import { z } from "zod"

export const addressSchema = z.object({
  addressId: z.string().optional(),
  addressName: z.string().nonempty("请填写资料名称"),
  firstName: z.string().nonempty("请填写名"),
  lastName: z.string().nonempty("请填写姓"),
  address: z.string().nonempty("请填写地址"),
  city: z.string().nonempty("请填写城市"),
  countryCode: z.string().nonempty("请选择国家/地区"),
  postalCode: z.string().nonempty("请填写邮编"),
  company: z.string().optional(),
  province: z.string().optional(),
  phone: z
    .string()
    .nonempty("请填写电话")
    .regex(/^\+?[0-9\s\-()]+$/, "电话格式不正确"),
  metadata: z.record(z.any()).optional(),
})

export type AddressFormData = z.infer<typeof addressSchema>
