import { z } from 'zod';

export const registerFormSchema = z.object({
  firstName: z
    .string()
    .nonempty('请填写名')
    .max(50, '名最多 50 个字符'),
  lastName: z
    .string()
    .nonempty('请填写姓')
    .max(50, '姓最多 50 个字符'),
  email: z
    .string()
    .nonempty('请填写邮箱')
    .email('邮箱格式不正确')
    .max(60, '邮箱最多 60 个字符'),
  password: z
    .string()
    .nonempty('请填写密码')
    .min(8, '密码至少 8 个字符')
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
      message:
        '密码需包含大写字母、数字和特殊字符'
    })
    .max(64, '密码最多 64 个字符'),
  phone: z
    .string()
    .min(6, '请填写电话')
    .regex(/^\+?\d+$/, { message: '电话只能包含数字' })
    .max(20, '电话最多 20 个字符')
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;
