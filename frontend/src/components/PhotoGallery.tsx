'use client';
import { searchPhotos, UnsplashPhoto } from '@/lib/unsplash';
import { useEffect, useState } from 'react';

export const usePhotoGallery = ({
  query,
  page,
  perPage,
}: {
  query: string;
  page: number;
  perPage: number;
}) => {
  //写真の配列を管理する状態変数
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  //データ取得のローディング状態を管理する状態変数
  const [loading, setLoading] = useState(true);
  //エラー状態を管理する状態変数
  const [error, setError] = useState<string | null>(null);
  //写真を取得する副作用を管理するためのuseEffectフック
  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true); //再取得時にローディング状態をリセットする

      try {
        const photos = await searchPhotos(query, page, perPage); //写真を検索する関数を呼び出す
        setPhotos(photos);
        setLoading(false);
      } catch (error) {
        setError('画像の取得に失敗しました。');
      } finally {
        setLoading(false);
      } //ローディング状態を終了する
    };
    fetchPhotos();
  }, [query, page, perPage]); //検索クエリ、ページ番号、1ページあたりの写真数が変更されたときに再度データを取得するための依存配列
  return { photos, loading, error };
};
