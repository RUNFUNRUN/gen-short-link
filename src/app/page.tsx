'use client';

import { LinkCard } from '@/components/link-card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  getAllLocalStorageLinks,
  resetLinksLocalStorage,
  setNewLocalStorageLink,
} from '@/lib/local-storage';
import { type linksSchema, urlSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { hc } from 'hono/client';
import { useEffect, useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import type { AppType } from './api/[[...hono]]/route';

const client = hc<AppType>('/');

const Page = () => {
  const [newLink, setNewLink] = useState<{
    key: string;
    originalUrl: string;
  }>();
  const { toast } = useToast();
  const generate = useId();
  const [historyLinks, setHistoryLinks] = useState<z.infer<typeof linksSchema>>(
    [],
  );

  useEffect(() => {
    setHistoryLinks(getAllLocalStorageLinks());
  }, []);

  const form = useForm<z.infer<typeof urlSchema>>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (json: z.infer<typeof urlSchema>) => {
    try {
      setHistoryLinks(getAllLocalStorageLinks());

      const res = await client.api.$post({ json });
      if (res.status !== 201) {
        throw new Error();
      }
      const key = (await res.json()).key;
      form.reset();
      const originalUrl = json.url;

      setNewLink({ key, originalUrl });
      setNewLocalStorageLink({ key, originalUrl });
    } catch {
      toast({ title: 'An error occurred.', variant: 'destructive' });
    }
  };

  const handleReset = () => {
    resetLinksLocalStorage();
    setHistoryLinks(getAllLocalStorageLinks());
  };

  return (
    <main className='md:mx-auto md:max-w-[1000px] space-y-20 mb-20'>
      <Form {...form}>
        <form
          className='flex flex-col md:flex-row gap-2 mt-20'
          onSubmit={form.handleSubmit(onSubmit)}
          id={generate}
        >
          <FormField
            control={form.control}
            name='url'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Input
                    {...field}
                    placeholder='https://...'
                    className='text-base md:text-lg h-10 rounded-lg font-[family-name:var(--font-geist-mono)]'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            className='text-md md:text-xl font-bold md:w-32 rounded-lg h-10'
            disabled={isSubmitting}
          >
            Generate
          </Button>
        </form>
      </Form>
      {newLink ? (
        <LinkCard linkKey={newLink.key} originalUrl={newLink.originalUrl} />
      ) : (
        <div className='border rounded-lg shadow-md h-20' />
      )}
      <div className='space-y-4'>
        <div className='flex justify-between'>
          <h2 className='text-xl font-bold'>History</h2>
          <button
            type='button'
            className='underline text-red-500 mt-auto font-bold'
            onClick={handleReset}
          >
            reset
          </button>
        </div>
        {historyLinks.length === 0 && (
          <div className='border rounded-lg shadow-md h-20' />
        )}
        {historyLinks.map(({ key, originalUrl }) => (
          <LinkCard key={key} linkKey={key} originalUrl={originalUrl} />
        ))}
      </div>
    </main>
  );
};

export default Page;
