import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  keywords?: string[];
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
  return files
    .map(filename => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8');
      const { data } = matter(raw);
      return {
        slug: data.slug || filename.replace(/\.md$/, ''),
        title: data.title || '',
        date: data.date || '',
        description: data.description || '',
        keywords: data.keywords || [],
      };
    })
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

export function getPostBySlug(slug: string): Post | null {
  if (!fs.existsSync(BLOG_DIR)) return null;
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
  for (const filename of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8');
    const { data, content } = matter(raw);
    const postSlug = data.slug || filename.replace(/\.md$/, '');
    if (postSlug === slug) {
      return {
        slug: postSlug,
        title: data.title || '',
        date: data.date || '',
        description: data.description || '',
        keywords: data.keywords || [],
        content,
      };
    }
  }
  return null;
}
