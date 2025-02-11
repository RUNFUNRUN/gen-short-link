import type { z } from 'zod';
import { type linkSchema, linksSchema } from './schema';

export const getAllLocalStorageLinks = () => {
  const linksLocalStorage = localStorage.getItem('links');

  if (!linksLocalStorage) {
    return [];
  }

  try {
    const parsed = JSON.parse(linksLocalStorage);
    const validLinks = linksSchema.parse(parsed);
    return validLinks;
  } catch (error) {
    localStorage.clear();
    return [];
  }
};

export const setNewLocalStorageLink = (newLink: z.infer<typeof linkSchema>) => {
  try {
    const linksLocalStorage = localStorage.getItem('links');
    if (!linksLocalStorage) {
      throw new Error('No links found in local storage');
    }
    const parsed = JSON.parse(linksLocalStorage);
    const validLinks = linksSchema.parse(parsed);
    const links = [newLink, ...validLinks];
    localStorage.setItem('links', JSON.stringify(links));
  } catch (error) {
    localStorage.setItem('links', JSON.stringify([newLink]));
  }
};

export const resetLinksLocalStorage = () => {
  localStorage.removeItem('links');
};
