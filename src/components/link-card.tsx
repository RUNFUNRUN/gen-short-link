'use client';

import { cn } from '@/lib/utils';
import { Check, Clipboard, CornerDownRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const Content = ({
  linkKey,
  originalUrl,
}: { linkKey: string; originalUrl: string }) => {
  const [isCopied, setIsCopied] = useState(false);
  const siteUrl = new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  );
  const link = new URL(linkKey, siteUrl).href;

  const handleCopy = async () => {
    setIsCopied(true);
    navigator.clipboard.writeText(link);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsCopied(false);
  };

  return (
    <>
      <div className='truncate'>
        <Link
          href={originalUrl}
          target='_blank'
          className='underline text-base md:text-lg font-[family-name:var(--font-geist-mono)]'
        >
          {originalUrl}
        </Link>
      </div>
      <div className='flex gap-1'>
        <CornerDownRight className='my-auto' />
        <Link
          href={`/${linkKey}`}
          target='_blank'
          className='underline text-lg md:text-xl font-[family-name:var(--font-geist-mono)]'
        >
          {link}
        </Link>
        <button type='button' className='my-auto ml-1' onClick={handleCopy}>
          {isCopied ? <Check size={20} /> : <Clipboard size={20} />}
        </button>
      </div>
    </>
  );
};

export const LinkCard = ({
  linkKey,
  originalUrl,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  linkKey: string;
  originalUrl: string;
}) => {
  return (
    <div
      className={cn(
        'border rounded-lg text-lg px-3 py-2 flex flex-col gap-1 shadow-md',
        className,
      )}
      {...props}
    >
      <Content linkKey={linkKey} originalUrl={originalUrl} />
    </div>
  );
};
