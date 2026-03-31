'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';
export const Header = () => {
  //1. ルーターを使用してページ遷移を制御するためのフック
  const router = useRouter();
  //検索パラメータを取得するためのフック
  const searchParams = useSearchParams();
  //3. 入力テキストを管理する状態変数（リロードしても）
  const [text, setText] = useState(searchParams.get('query') || '');
  // const [text, setText] = useState('');

  //検索ボタンを押したときの処理
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); //フォームのデフォルトの送信動作を防止する
    router.push(`/?query=${text.trim() || 'latest'}`); //入力テキストが空の場合は'latest'を検索クエリにセットする
  };
  return (
    <header className='w-full p-4 border-b'>
      <div className='flex items-center justify-between max-w-3xl mx-auto'>
        <h1 className='text-xl font-bold'>Moments</h1>
        <div className='flex items-center gap-2'>
          <input
            type='text'
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Search photos...'
            className='h-8 rounded-lg border border-gray-300 px-2.5 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          />
          <Button
            onClick={handleSearch}
            variant='outline'
            className='h-8 px-4 rounded-lg  transition-colors'
          >
            Search
          </Button>
        </div>
      </div>
    </header>
  );
};
