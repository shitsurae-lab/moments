'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';
import { LogIn, LogOut, UserRound } from 'lucide-react'; // アイコンを追加
import Link from 'next/link'; // ページ遷移用に追加
import { useAuth } from '@/hooks/useAuth';

export const Header = () => {
  //1. ルーターを使用してページ遷移を制御するためのフック
  const router = useRouter();
  //検索パラメータを取得するためのフック
  const searchParams = useSearchParams();
  //3. 入力テキストを管理する状態変数（リロードしても）
  const [text, setText] = useState(searchParams.get('query') || '');
  //4.
  const { isLoggedIn, loading, logout } = useAuth();

  //検索ボタンを押したときの処理
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); //フォームのデフォルトの送信動作を防止する
    router.push(`/?query=${text.trim() || 'latest'}`); //入力テキストが空の場合は'latest'を検索クエリにセットする
  };
  return (
    <header className='w-full p-4 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50'>
      <div className='flex items-center justify-between max-w-3xl mx-auto gap-4'>
        <h1 className='text-xl font-bold shrink-0'>
          <Link href='/'>Moments</Link>
        </h1>

        <div className='flex items-center gap-2 flex-1 justify-end'>
          <form onSubmit={handleSearch} className='flex items-center gap-2'>
            <input
              type='text'
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='Search photos...'
              className='h-8 w-32 md:w-48 rounded-lg border border-gray-300 px-2.5 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            />
            <Button
              type='submit' // onClickを外してform送信に合わせるとより実務的だよ
              variant='outline'
              className='h-8 px-4 rounded-lg transition-colors'
            >
              Search
            </Button>
          </form>
          {/* 条件分岐で置き換える */}
          {!loading && (
            <div className='flex items-center gap-2'>
              {isLoggedIn ? (
                <>
                  <div className='h-8 w-8 round-full bg-muted grid place-items-center'>
                    <UserRound className='h-4 w-4' />
                  </div>
                  <Button
                    variant='ghost'
                    className='h-8 gap-2 px-3'
                    onClick={logout}
                  >
                    <LogOut className='h-4 w-4' />
                    <span className='hidden sm:inline'>ログアウト</span>
                  </Button>
                </>
              ) : (
                <Link href='/login' passHref>
                  <Button variant='ghost' className='h-8 gap-2 px-3'>
                    <LogIn className='h-4 w-4' />
                    <span className='hidden sm:inline'>ログイン</span>
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
