import { EllipsisVertical } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type props = {
  postId: number;
  onDelete: () => void; // 削除後に呼び出す関数
};

export const DeletePostButton = ({ postId, onDelete }: props) => {
  const handleDelete = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    // await fetch(`${apiUrl}/api/posts/${postId}`, {
    //   method: 'DELETE',
    // });
    // ✨️デバッグ強化版
    const res = await fetch(`${apiUrl}/api/posts/${postId}`, {
      method: 'DELETE',
    });

    console.log('status:', res.status);

    const data = await res.json();
    console.log('response:', data);

    // ✨️END デバッグ強化版

    onDelete();
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <EllipsisVertical className='w-5 h-5 cursor-pointer' />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>投稿を削除しますか？</AlertDialogTitle>
          <AlertDialogDescription>
            この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>削除する</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
