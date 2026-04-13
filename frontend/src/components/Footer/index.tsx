'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Home, Plus } from 'lucide-react';
//shadcn/uiから必要なパーツをインポート
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { PostForm } from '@/components/PostForm';

interface FooterProps {
  refetch: () => void;
}
export const Footer = ({ refetch }: FooterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <footer className='fixed bottom-0 left-0 z-50 w-full h-16 border-t bg-background/80 backdrop-blur-md px-4'>
      <div className='flex items-center justify-center gap-16 max-w-3xl mx-auto h-full'>
        <Button variant='ghost' size='icon' className='hover:bg-transparent'>
          <Home className='w-6 h-6' />
        </Button>
        {/* 投稿用ポップアップの組み込み */}
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
          {/* Trigger がクリックされるとダイアログが開きます */}
          <DialogTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='hover:bg-transparent
              transition-transform active:scale-95'
            >
              <Plus className='w-6 h-6' />
            </Button>
          </DialogTrigger>

          {/* ポップアップの中身 */}
          <DialogContent className='sm:max-w-[424px]'>
            <DialogHeader>
              <DialogTitle>新規投稿を作成</DialogTitle>
            </DialogHeader>
            {/* フォームを配置 */}
            <div className='py-4'>
              <PostForm
                onSuccess={() => {
                  setIsOpen(false);
                  refetch();
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </footer>
  );
};
