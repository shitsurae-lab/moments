import { searchPhotos } from '@/lib/unsplash';
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

export default async function Home() {
  const photos = await searchPhotos('nature', 1, 5);
  // const [photo, setPhoto] = useState<UnsplashPhoto | null>(null); から、useEffectを使用してコンポーネントがマウントされたときに写真を取得することもできます。
  //useEffect(() => {const[photo, setPhoto] = useState<UnsplashPhoto | null>(null); const fetchPhoto = async () => {const photos = await searchPhotos('nature', 1, 5); if (photos.length > 0) {setPhoto(photos[0]);}}; fetchPhoto();}, []);
  console.log('Fetched photos:', photos);
  return (
    <>
      <main className='flex flex-col items-center justify-center'>
        <h1 className='text-3xl font-bold'>Hello world!</h1>
        <Card className='relative mx-auto w-full max-w-sm pt-0'>
          <div className='absolute inset-0 z-30 aspect-video bg-black/35' />
          <img
            src='https://avatar.vercel.sh/shadcn1'
            alt='Event cover'
            className='relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40'
          />
          <CardHeader>
            <CardAction>
              <Badge variant='secondary'>Featured</Badge>
            </CardAction>
            <CardTitle>Design systems meetup</CardTitle>
            <CardDescription>
              A practical talk on component APIs, accessibility, and shipping
              faster.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className='w-full'>View Event</Button>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}
