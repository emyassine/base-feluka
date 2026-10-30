import collections from '../../../vitepress-site/.vitepress/generated/collections.json';

export interface CollectionArticle {
  title: string;
  description: string;
  date: string;
  category: string;
  wordCount: number;
  readingTime: number;
  url: string;
}

export interface ContentCollection {
  id: string;
  path: string;
  titles: Record<string, string>;
  descriptions: Record<string, string>;
  links: Record<string, string>;
  layout: 'article' | 'doc';
  indexLayout: 'list' | 'spotlight';
  categories: Record<string, Array<{ id: string; label: string }>>;
  articles: Record<string, CollectionArticle[]>;
}

const allCollections = collections as ContentCollection[];

export function useCollection(id: string): ContentCollection | undefined {
  return allCollections.find((collection) => collection.id === id);
}

export function queryCollection(
  id: string,
  predicate: (article: CollectionArticle) => boolean,
  locale = 'en'
): CollectionArticle[] {
  const collection = useCollection(id);
  const articles = collection?.articles[locale] ?? collection?.articles.en ?? [];
  return articles.filter(predicate);
}
