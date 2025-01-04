'use client';

import { Button } from '@/lib/ui/components/Button';
import { Input } from '@/lib/ui/components/Input';
import { Label } from '@/lib/ui/components/Label';
import AuthApiService from '@/lib/ui/services/AuthApi.service';
import { hashClientPassword } from '@/lib/ui/utils/Hash.utils';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => setEmail(event.target.value);
  const handlePasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => setPassword(event.target.value);

  const handleLoginClick = async (): Promise<void> => {
    const hashedPassword = await hashClientPassword(password);

    const response = await toast.promise(
      AuthApiService.login({
        email,
        password: hashedPassword,
      }),
      {
        pending: 'Logging in...',
      },
    );

    if (!response?.result?.token) {
      toast.error('Failed to login');

      return;
    }

    Cookies.set('token', response.result.token);
    Cookies.set('refreshToken', response.result.refreshToken);

    toast.success('Login successful. Redirecting...');
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  return (
    <div className="flex size-full flex-col items-center justify-center bg-white text-neutral-950 shadow dark:border-neutral-300 dark:bg-neutral-800 dark:text-neutral-50 lg:overflow-hidden">
      <div className="flex w-3/4 flex-col gap-10 lg:w-96">
        <div className="flex flex-col gap-6">
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              className="block w-full"
              name="email"
              onChange={handleEmailChange}
              type="email"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="email">Password</Label>
            <Input
              className="block w-full"
              name="password"
              onChange={handlePasswordChange}
              type="password"
            />
          </div>
        </div>
        <Button onClick={handleLoginClick}>Login</Button>
      </div>
    </div>
  );
};

export default LoginPage;
