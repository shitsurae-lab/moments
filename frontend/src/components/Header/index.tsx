'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { LogIn, LogOut, UserRound } from 'lucide-react'; // アイコンを追加
import Image from 'next/image';
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
          <form onSubmit={handleSearch} className='relative flex items-center'>
            {/* アイコンを絶対配置で入力ボックスに重ねる */}
            <Search className='absolute left-3 h-4 w-4 text-gray-400' />

            <input
              type='text'
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='Search photos...'
              // px-2.5 を pl-10 に変更して、左側にアイコン分の余白を作る
              className='h-9 w-48 md:w-64 rounded-full border border-gray-300 pl-10 pr-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
            />
          </form>
          {/* 条件分岐で置き換える */}
          {!loading && (
            <div className='flex items-center gap-2'>
              {/* AnimatePresence: 要素が消える時の exit アニメーションを有効にするために必要。mode='wait': 前の要素が消え終わってから次の要素を出し、重なりを防ぐ。key: keyが変わることで、Framer Motionが「別の要素に切り替わった」と認識し、アニメーションが発火する。 */}
              <AnimatePresence mode='wait'>
                {isLoggedIn ? (
                  <motion.div
                    key='user-area'
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className='flex items center gap-2' //アバターとボタンを横並びにする
                  >
                    <div className='h-8 w-8 rounded-full bg-muted grid place-items-center overflow-hidden relative'>
                      <Image
                        src='/images/avatar.webp'
                        alt='vector-n'
                        fill
                        className='object-cover'
                      />
                    </div>
                    <Button
                      variant='ghost'
                      className='h-8 gap-2 px-3'
                      onClick={logout}
                    >
                      <LogOut className='h-4 w-4' />
                      <span className='hidden sm:inline'>ログアウト</span>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key='login-area'
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <Link href='/login' passHref>
                      <Button variant='ghost' className='h-8 gap-2 px-3'>
                        <LogIn className='h-4 w-4' />
                        <span className='hidden sm:inline'>ログイン</span>
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
