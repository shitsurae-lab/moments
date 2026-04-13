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
import { UserRound } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UnifiedPost } from '@/lib/UnifiedPost';

//フッターの読み込み
import { Footer } from '@/components/Footer';
//🌻 機能
//機能1. カスタムフックを使用して写真を取得する
import { usePhotoGallery } from '@/components/PhotoGallery';

import { PhotoSkeleton } from '@/components/PhotoSkelton';
import { LikeButton } from '@/components/LikeButton';
import { useMomentsGallery } from '@/components/MomentsGallery';
import { DeletePostButton } from '@/components/DeletePostButton';

export default function Page() {
  // 🌹URLの検索パラメータからクエリを取得する。クエリがない場合は'popular'をデフォルト値として使用する
  const query = useSearchParams().get('query') || 'popular';
  //機能. カスタムフックを使用して写真を取得する
  const {
    photos: unsplashPhotos,
    loading: unsplashLoading,
    error: unsplashError,
    ref: unsplashRef,
  } = usePhotoGallery({
    query: query, //検索クエリ
    perPage: 8,
  });

  //UTMパラメータを定数として定義する。これを使用して、Unsplashの写真へのリンクにトラッキング情報を追加することで、どの写真がどれだけクリックされたかを分析できるようにする
  const UTM =
    'utm_source=portfolio&utm_medium=referral&utm_campaign=moments_app';
  const unsplashPosts: UnifiedPost[] = unsplashPhotos.map((photo) => ({
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

  //オブジェクトの分割代入とリネーム↓
  const {
    posts: momentsPosts, // [...];postsをmomentsPostsに
    loading: momentsLoading, //false; loadingをmomentsLoadingに
    error: momentsError, // null; errorをmomentsErrorに
    refetch: momentsRefetch,
  } = useMomentsGallery();

  //loadingはunsplash, momentsloadingはmoments
  const isLoading = unsplashLoading || momentsLoading;
  const isError = unsplashError || momentsError;

  const allPosts = [...momentsPosts, ...unsplashPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <>
      <main className='flex flex-col items-center justify-center'>
        <div className='w-full max-w-sm mb-10 py-5'>
          {isLoading && (
            <ul className='grid gap-4 w-full max-w-sm'>
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i}>
                  <PhotoSkeleton />
                </li>
              ))}
            </ul>
          )}
          {isError && <p>Error: {isError}</p>}
          {!isLoading && !isError && allPosts.length === 0 && (
            <p>投稿がまだありません</p>
          )}
          {!isLoading && !isError && allPosts.length > 0 && (
            <ul className='grid gap-10 w-full max-w-sm'>
              {allPosts.map((post) => (
                <li key={post.id}>
                  <div className='mb-2 flex justify-between items-center'>
                    {post.source === 'unsplash' ? (
                      <a
                        href={`${post.avatarLink}?${UTM}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex justify -between gap-2'
                      >
                        <Avatar>
                          <AvatarImage
                            src={post.avatarIcon}
                            alt={post.authorName}
                          />
                          <AvatarFallback>{post.authorName}</AvatarFallback>
                        </Avatar>
                        <span className='text-sm'>{post.authorName}</span>
                      </a>
                    ) : (
                      <div className='flex justify -between gap-2'>
                        <Avatar>
                          <AvatarImage
                            src={post.avatarIcon}
                            alt={post.authorName}
                          />
                          <AvatarFallback>
                            <UserRound />
                          </AvatarFallback>
                        </Avatar>
                        <span className='text-sm'>{post.authorName}</span>
                      </div>
                    )}
                    <div className='flex items-center gap-2'>
                      <span className='text-xs text-muted-foreground'>
                        on{' '}
                        {post.source === 'unsplash' ? (
                          <a
                            href={`https://unsplash.com/?${UTM}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='underline hover:text-foreground'
                          >
                            {post.tag || 'Unsplash'}
                          </a>
                        ) : (
                          <span className=''>{post.tag || 'Moments'}</span>
                        )}
                      </span>
                      {post.source === 'moments' && (
                        <DeletePostButton
                          postId={post.postId!}
                          onDelete={momentsRefetch}
                        />
                      )}
                    </div>
                  </div>

                  <Card className='relative mx-auto w-full max-w-sm pt-0'>
                    <a
                      href={post.imageUrl + '?' + UTM}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <div className='relative aspect-4/3 w-full'>
                        <Image
                          src={post.imageUrl}
                          alt={post.title || 'Unsplash Photo'}
                          fill
                          className='object-cover'
                          sizes='(max-width: 768px) 100vw, 400px'
                        />
                      </div>
                    </a>
                    <CardHeader className='flex flex-col items-start gap-5'>
                      <CardTitle className='capitalize'>{post.title}</CardTitle>
                      <CardDescription>
                        {post.description || post.description}
                      </CardDescription>
                      <CardAction>
                        {post.source === 'unsplash' ? (
                          <Badge variant='secondary' className='uppercase'>
                            unsplash
                          </Badge>
                        ) : (
                          <Badge variant='secondary' className='uppercase'>
                            {post.tag || 'moments'}
                          </Badge>
                        )}
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
          <div ref={unsplashRef} className='h-10 flex justify-center'>
            {isLoading && <PhotoSkeleton />}
          </div>
        </div>
      </main>
      <Footer refetch={momentsRefetch} />
    </>
  );
}
