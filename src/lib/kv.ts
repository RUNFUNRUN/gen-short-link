export const createKey = async (
  kv: KVNamespace,
  url: string,
): Promise<string> => {
  const uuid = crypto.randomUUID();
  const key = uuid.substring(0, 6);
  const result = await kv.get(key);
  if (!result) {
    await kv.put(key, url);
  } else {
    return await createKey(kv, url);
  }
  return key;
};
