import { getCloudflareContext } from '@opennextjs/cloudflare';
import { redirect } from 'next/navigation';

const Page = async (props: { params: Promise<{ key: string }> }) => {
  const params = await props.params;
  const key = params.key;
  const { env } = getCloudflareContext();
  const kvs = env.LINK_KV;
  const url = await kvs.get(key);
  if (!url) {
    redirect('/');
  }
  redirect(url);
};

export default Page;
