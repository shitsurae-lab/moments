'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
//🌻 機能
//機能1. カスタムフックを使用して写真を取得する
import { usePhotoGallery } from '@/components/PhotoGallery';
//
import { PhotoSkeleton } from '@/components/PhotoSkelton';

export default function Home() {
  // 🌹URLの検索パラメータからクエリを取得する。クエリがない場合は'popular'をデフォルト値として使用する
  const query = useSearchParams().get('query') || 'popular';
  //機能. カスタムフックを使用して写真を取得する
  const { photos, loading, error, ref } = usePhotoGallery({
    query: query, //検索クエリ
    perPage: 8,
  });

  return (
    <>
      <main className='flex flex-col items-center justify-center'>
        {loading && (
          <ul className='grid gap-4 w-full max-w-sm'>
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i}>
                <PhotoSkeleton />
              </li>
            ))}
          </ul>
        )}
        {error && <p>Error: {error}</p>}
        {!loading && !error && photos.length === 0 && (
          <p>投稿がまだありません</p>
        )}
        {!loading && !error && photos.length > 0 && (
          <ul className='grid gap-4 w-full max-w-sm'>
            {photos.map((photo) => (
              <li key={photo.id}>
                <Card className='relative mx-auto w-full max-w-sm pt-0'>
                  <div className='relative aspect-4/3 w-full'>
                    <Image
                      src={photo.urls.small}
                      alt={photo.alt_description || 'Unsplash Photo'}
                      fill
                      className='object-cover'
                      sizes='(max-width: 768px) 100vw, 400px'
                    />
                  </div>
                  <CardHeader>
                    <CardAction>
                      <Badge variant='secondary'>Featured</Badge>
                    </CardAction>
                    <CardTitle>Design systems meetup</CardTitle>
                    <CardDescription>
                      {photo.description || photo.alt_description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className='w-full'>View Event</Button>
                  </CardFooter>
                </Card>
                {/* <p>{photo.description || photo.alt_description}</p>
              <p>By: {photo.user.name}</p> */}
              </li>
            ))}
          </ul>
        )}
        <div ref={ref} className='h-10 flex justify-center'>
          {loading && <PhotoSkeleton />}
        </div>
      </main>
    </>
  );
}
