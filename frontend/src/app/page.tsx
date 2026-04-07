'use client';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UnifiedPost } from '@/lib/UnifiedPost';

//🌻 機能
//機能1. カスタムフックを使用して写真を取得する
import { usePhotoGallery } from '@/components/PhotoGallery';

import { PhotoSkeleton } from '@/components/PhotoSkelton';
import { LikeButton } from '@/components/LikeButton';

export default function Home() {
  // 🌹URLの検索パラメータからクエリを取得する。クエリがない場合は'popular'をデフォルト値として使用する
  const query = useSearchParams().get('query') || 'popular';
  //機能. カスタムフックを使用して写真を取得する
  const { photos, loading, error, ref } = usePhotoGallery({
    query: query, //検索クエリ
    perPage: 8,
  });

  //UTMパラメータを定数として定義する。これを使用して、Unsplashの写真へのリンクにトラッキング情報を追加することで、どの写真がどれだけクリックされたかを分析できるようにする
  const UTM =
    'utm_source=portfolio&utm_medium=referral&utm_campaign=moments_app';
  const unsplashPosts: UnifiedPost[] = photos.map((photo) => ({
    id: photo.id,
    source: 'unsplash' as const,
    imageUrl: photo.urls.small,
    authorName: photo.user.name,
    avatarIcon: photo.user.profile_image.small,
    avatarLink: photo.user.links.html,
    tag: photo.tags?.[0]?.title,
    title: photo.alt_description ?? '',
    description: photo.description,
    createdAt: photo.created_at,
  }));
  return (
    <>
      <main className='flex flex-col items-center justify-center'>
        <div className='w-full max-w-sm mb-10 py-5'>
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
            <ul className='grid gap-10 w-full max-w-sm'>
              {unsplashPosts.map((photo) => (
                <li key={photo.id}>
                  <div className='mb-2 flex justify-between items-center'>
                    <a
                      href={`${photo.avatarLink}?${UTM}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex justify -between gap-2'
                    >
                      <Avatar>
                        <AvatarImage
                          src={photo.avatarIcon}
                          alt={photo.authorName}
                        />
                        <AvatarFallback>{photo.authorName}</AvatarFallback>
                      </Avatar>
                      <span className='text-sm'>{photo.authorName}</span>
                    </a>
                    <span className='text-xs text-muted-foreground'>
                      on{' '}
                      <a
                        href={`https://unsplash.com/?${UTM}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='underline hover:text-foreground'
                      >
                        {photo.tag || 'Unsplash'}
                      </a>
                    </span>
                  </div>

                  <Card className='relative mx-auto w-full max-w-sm pt-0'>
                    <a
                      href={photo.imageUrl + '?' + UTM}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <div className='relative aspect-4/3 w-full'>
                        <Image
                          src={photo.imageUrl}
                          alt={photo.title || 'Unsplash Photo'}
                          fill
                          className='object-cover'
                          sizes='(max-width: 768px) 100vw, 400px'
                        />
                      </div>
                    </a>
                    <CardHeader className='flex flex-col items-start gap-5'>
                      <CardTitle className='capitalize'>
                        {photo.title}
                      </CardTitle>
                      <CardDescription>
                        {photo.description || photo.description}
                      </CardDescription>
                      <CardAction>
                        <Badge variant='secondary' className='uppercase'>
                          unsplash
                        </Badge>
                      </CardAction>
                    </CardHeader>
                    <CardFooter className='justify-end'>
                      <LikeButton />
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
        </div>
      </main>
    </>
  );
}
