'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { on } from 'events';

interface PostFormProps {
  //投稿成功時のコールバック関数を受け取るためのプロパティ
  onSuccess: () => void;
}
export const PostForm = ({ onSuccess }: PostFormProps) => {
  //ユーザーが入力した内容を一時的に保存するための状態（ステート）変数を定義する
  const [image, setImage] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  //送信ボタンが押されたときの処理（）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;
    //画像を送るためのFormDataオブジェクトを準備する
    const formData = new FormData();
    formData.append('image', image); //画像ファイルを追加する
    formData.append('caption', caption); //説明文を追加する
    formData.append('tags', tags); //タグを追加する
    try {
      //
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      //バックエンドのAPIエンドポイントにPOSTリクエストを送る
      const response = await fetch(`${apiUrl}/api/posts`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('送信に失敗しました...');
      }
      //
      const data = await response.json();
      console.log('Lavavelからの返事', data);
      //投稿成功時のコールバック関数を呼び出す
      onSuccess();
    } catch (error) {
      console.error('Error uploading post:', error);
      alert('投稿の送信に失敗しました。');
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-md mx-auto p-4 border rounded-lg'
    >
      {/* 画像ファイルの入力 */}
      <div>
        <label className='block text-sm font-medium mb-1'>
          画像をアップロード
        </label>
        <Input
          type='file'
          accept='image/*'
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
      </div>
      {/* 説明文 */}
      <div className='block text-sm font-medium mb-1'>
        <label className='block text-sm font-medium mb-1'>説明文を入力</label>
        <Input
          placeholder='説明文'
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>
      {/* タグ */}
      <div className='block text-sm font-medium mb-1'>
        <label className='block text-sm font-medium mb-1'>タグを入力</label>
        <Input
          placeholder='タグ'
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <Button type='submit'>アップロード</Button>
    </form>
  );
};
