'use client';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from './ui/button';

export const LikeButton = () => {
  const [isLiked, setIsLiked] = useState(false);
  return (
    <Button
      variant='ghost'
      onClick={() => setIsLiked(!isLiked)}
      size='icon'
      className='hover:bg-transparent'
    >
      <Heart
        //Lucideのアイコンは、SVGのため、fill属性に値を入れようとすると、デフォルト値である#000000がはいってしまう。そのため、classNameでfillとtextの両方を切り替えることで、選択時は赤く、未選択時はグレーの枠線のみになるようにする
        className={`w-5 h-5 transition-colors ${
          isLiked
            ? 'fill-red-500 text-red-500' // 選択時：中身を赤く、枠線も赤く
            : 'text-muted-foreground' // 未選択時：グレーの枠線のみ（中身は透明）
        }`}
      />
    </Button>
  );
};
