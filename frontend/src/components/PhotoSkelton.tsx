import { Card, CardHeader, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const PhotoSkeleton = () => (
  <Card className='relative mx-auto w-full max-w-sm pt-0'>
    {/* 画像部分：本物の画像と同じ aspect-video を指定 */}
    <Skeleton className='aspect-video w-full rounded-t-2xl' />

    <CardHeader className='space-y-2'>
      <Skeleton className='h-5 w-20' />
      <Skeleton className='h-7 w-3/4' />
      <div className='space-y-1'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-5/6' />
      </div>
    </CardHeader>

    <CardFooter>
      <Skeleton className='h-10 w-full' />
    </CardFooter>
  </Card>
);
