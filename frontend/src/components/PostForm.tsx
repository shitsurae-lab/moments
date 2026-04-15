'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface PostFormProps {
  onSuccess: () => void;
}

export const PostForm = ({ onSuccess }: PostFormProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [imageError, setImageError] = useState('');
  const [titleError, setTitleError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) {
      setImageError('画像を選択してください');
      return;
    }
    if (!title) {
      setTitleError('タイトルを入力してください');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', title);
    formData.append('caption', caption);
    formData.append('tags', tags);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/api/posts`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('送信に失敗しました...');
      }

      const data = await response.json();
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
        {imageError && <p>{imageError}</p>}
      </div>
      {/* タイトル */}
      <div className='mt-2'>
        <label className='block text-sm font-medium mb-1'>タイトル</label>
        <Input
          placeholder='タイトル'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {titleError && <p>{titleError}</p>}
      </div>
      {/* 説明文 */}
      <div className='mt-2'>
        <label className='block text-sm font-medium mb-1'>説明文を入力</label>
        <Input
          placeholder='説明文'
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>
      {/* タグ */}
      <div className='mt-2'>
        <label className='block text-sm font-medium mb-1'>タグを入力</label>
        <Input
          placeholder='横浜, 風景, 夕日'
          value={tags}
          onChange={(e) => {
            const input = e.target.value; // e.target.valueから取得
            const tagArray = input.split(',');
            if (tagArray.length <= 3) {
              setTags(input);
            }
          }}
        />
      </div>
      <Button type='submit' className='mt-4'>
        アップロード
      </Button>
    </form>
  );
};
