'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth/googleAuth';

interface ChessCloudIconProps {
  className?: string;
}

export default function ChessCloudIcon({
  className = '',
}: ChessCloudIconProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    router.push(isAuthenticated() ? '/home' : '/');
  };

  if (!mounted) {
    return (
      <div
        onClick={handleClick}
        className="
          h-8 w-8
          rounded
          bg-amber-600 dark:bg-amber-500
          mr-2
          shadow-[0_8px_16px_rgba(180,83,9,0.2)] dark:shadow-[0_8px_16px_rgba(245,158,11,0.3)]
          animate-[float_8s_ease-in-out_infinite] dark:animate-[float_2s_ease-in-out_infinite]
        "
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`
        relative
        h-8 w-8
        rounded
        bg-amber-600 dark:bg-amber-500
        mr-2
        overflow-hidden
        transition-transform transition-shadow duration-700 hover:duration-[1500ms] ease-out dark:duration-300
        shadow-[0_8px_16px_rgba(180,83,9,0.2)] dark:shadow-[0_8px_16px_rgba(245,158,11,0.3)]
        hover:-translate-y-0.5
        hover:shadow-[0_8px_16px_rgba(180,83,9,0.2),0_0_12px_rgba(245,158,11,0.5),0_0_24px_rgba(245,158,11,0.3)]
        animate-[float_8s_ease-in-out_infinite] dark:animate-[float_2s_ease-in-out_infinite]
        ${className}
      `}
    >
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 p-[15%]">
        <div className="bg-amber-100" />
        <div className="bg-amber-800 dark:bg-amber-900" />
        <div className="bg-amber-800 dark:bg-amber-900" />
        <div className="bg-amber-100" />
      </div>
    </div>
  );
}
