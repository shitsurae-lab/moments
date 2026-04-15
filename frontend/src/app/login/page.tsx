'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import axios from '@/lib/axios';
import { useAuth } from '@/hooks/useAuth';

export default function Page() {
  const router = useRouter();
  //1. 入力内容を管理するための状態管理
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. CSRFクッキーの取得（合言葉をもらう）
      await axios.get('/sanctum/csrf-cookie');

      // 2. ログイン実行（ここを1回にするよ！）
      const response = await axios.post('/auth/login', {
        email: email,
        password: password,
      });

      // 3.トークンを保存
      localStorage.setItem('auth-token', response.data.token);


      // 4. 成功したらトップへ
      // router.refresh();
      router.push('/');
    } catch (error) {
      // エラーが起きたらメッセージを表示
      setError('メールアドレスかパスワードが違います。');
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className='relative min-h-screen w-full overflow-hidden'>
      <div className='flex items-center justify-center min-h-dvh'>
        <div className='flex flex-1 flex-col justify-center px-4 py-10 lg:px-6'>
          <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
            <h1 className='text-balance text-center text-lg font-semibold text-foreground dark:text-foreground'>
              Welcome Back
            </h1>
            <p className='text-pretty text-center text-sm text-muted-foreground dark:text-muted-foreground'>
              アカウント情報を入力してログインしてね。
            </p>
            <form onSubmit={handleLogin} className='mt-6 space-y-4'>
              {error && (
                <div className='bg-destructive/15 p-3 rounded-md text-destructive text-sm font-medium'>
                  {error}
                </div>
              )}
              <div className='space-y-2'>
                <Label
                  htmlFor='email'
                  className='text-sm font-medium text-foreground dark:text-foreground'
                >
                  Email
                </Label>
                <Input
                  type='email'
                  id='email'
                  placeholder='mail@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className='mt-2'
                />
              </div>
              <div className='space-y-2'>
                <Label
                  htmlFor='password'
                  className='text-sm font-medium text-foreground dark:text-foreground'
                >
                  Password
                </Label>
                <Input
                  type='password'
                  id='password'
                  placeholder='......'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className='mt-2'
                />
              </div>
              <Button
                type='submit'
                className='mt-4 w-full py-2 font-medium'
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ログイン中...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
