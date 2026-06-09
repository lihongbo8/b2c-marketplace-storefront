'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { FetchError } from '@medusajs/js-sdk';
import Link from 'next/link';
import { FieldError, FormProvider, useForm, useFormContext } from 'react-hook-form';

import { Button } from '@/components/atoms';
import { LabeledInput } from '@/components/cells';
import { sendResetPasswordEmail } from '@/lib/data/customer';
import { toast } from '@/lib/helpers/toast';

import { ForgotPasswordFormData, forgotPasswordSchema } from './schema';

export const ForgotPasswordForm = () => {
  const methods = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  return (
    <FormProvider {...methods}>
      <Form />
    </FormProvider>
  );
};

const Form = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset
  } = useFormContext<ForgotPasswordFormData>();

  const submit = async (data: ForgotPasswordFormData) => {
    if (!data.email) return;

    const result = await sendResetPasswordEmail(data.email);

    if (!result.success) {
      toast.error({ title: result.error || '操作失败，请稍后重试。' });
      return;
    }

    reset({ email: '' });

    toast.success({
      title: `如 ${data.email} 已注册，将收到重置链接。链接 1 小时内有效。`
    });
  };

  return (
    <div
      className="mx-auto mt-6 w-full max-w-xl space-y-4 rounded-sm border p-4"
      data-testid="forgot-password-form-container"
    >
      <h1 className="heading-md my-0 mb-2 uppercase text-primary">找回密码</h1>
      <p className="text-md">
        填写注册邮箱，接收重置链接。
      </p>
      <form
        onSubmit={handleSubmit(submit)}
        data-testid="forgot-password-form"
      >
        <div className="space-y-4">
          <LabeledInput
            label="邮箱"
            placeholder="填写邮箱"
            error={errors.email as FieldError}
            data-testid="forgot-password-email-input"
            {...register('email')}
          />
        </div>

        <div className="mt-8 space-y-4">
          <Button
            className="w-full uppercase"
            disabled={isSubmitting}
            data-testid="forgot-password-submit-button"
          >
            发送重置链接
          </Button>

          <Link
            href="/user"
            className="flex"
            data-testid="forgot-password-back-to-login-link"
          >
            <Button
              variant="tonal"
              className="flex w-full justify-center uppercase"
            >
              返回登录
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
};
