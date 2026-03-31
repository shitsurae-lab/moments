'use client';
import { searchPhotos, UnsplashPhoto } from '@/lib/unsplash';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export const usePhotoGallery = ({
  query,

  perPage,
}: {
  query: string;

  perPage: number;
}) => {
  //写真の配列を管理する状態変数
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  //データ取得のローディング状態を管理する状態変数
  const [loading, setLoading] = useState(true);
  //エラー状態を管理する状態変数
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);

  const { ref, inView } = useInView({
    rootMargin: '0px 0px 200px 0px', //要素が画面に入る前に200pxの余裕を持たせる
  });

  //検索クエリが変更されたときにページ番号をリセットし、写真の配列を空にする
  useEffect(() => {
    setPage(1);
    setPhotos([]);
  }, [query]);

  //写真を取得する副作用を管理するためのuseEffectフック
  useEffect(() => {
    const fetchPhotos = async () => {
      //最初のページ(page === 1)の時だけローディングを表示
      if (page === 1) setLoading(true);

      try {
        const newPhotos = await searchPhotos(query, page, perPage); //写真を検索する関数を呼び出す
        //既存のphotosに新しい写真を追加する。ページが1のときは新しい写真だけをセットし、それ以外のときは既存の写真に新しい写真を追加する。
        setPhotos((prev) => (page === 1 ? newPhotos : [...prev, ...newPhotos]));
        setLoading(false);
      } catch (error) {
        setError('画像の取得に失敗しました。');
      } finally {
        setLoading(false);
      } //ローディング状態を終了する
    };
    fetchPhotos();
  }, [query, page, perPage]); //検索クエリ、ページ番号、1ページあたりの写真数が変更されたときに再度データを取得するための依存配列
  useEffect(() => {
    if (inView && !loading && !error) {
      setPage((prev) => prev + 1); //要素が画面に入ったときにページ番号を増やす
    }
  }, [inView, loading, error]);

  return { photos, loading, error, ref };
};
