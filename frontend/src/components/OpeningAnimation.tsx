'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, easeOut } from 'framer-motion';

export const OpeningAnimation = () => {
  const [showOpening, setShowOpening] = useState<boolean | null>(null);

  useEffect(() => {
    const hasSeenAnimation = localStorage.getItem('hasSeenOpening');
    // 💡 setTimeoutで一瞬だけ遅らせる（タスクキューに入れる）ことで、初回レンダリングとの衝突を避け、警告を回避

    const timer = setTimeout(() => {
      setShowOpening(hasSeenAnimation === null);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleAnimationEnd = () => {
    localStorage.setItem('hasSeenOpening', 'true');
    setShowOpening(false);
  };

  // 💡 ここがポイント：
  // 判定中（null）の時は何も出さないが、false（終了後）の時は
  // AnimatePresenceに任せるために null を返さず最後まで実行させる。
  if (showOpening === null) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {showOpening && (
          <motion.div
            key='opening-screen' // 💡 keyを付けると確実です
            // 初期状態
            initial={{ opacity: 1, scale: 1 }}
            // 終了時（ふわっと広がりながら消える）
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{
              duration: 0.6,
              ease: easeOut,
            }}
            className='fixed inset-0 z-[100] flex items-center justify-center bg-white'
          >
            <div
              className='relative w-full max-w-40 overflow-hidden'
              style={{ aspectRatio: '1248/1574' }}
            >
              <video
                src='/videos/opening-moments-cropped.mp4'
                autoPlay
                muted
                playsInline
                onEnded={handleAnimationEnd}
                // object-cover を使うと、指定した枠の中に綺麗に収まるよ
                className='absolute inset-0 w-full h-full object-cover'
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
