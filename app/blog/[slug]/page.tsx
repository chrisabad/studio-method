import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { marked } from 'marked';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Studio Method`,
    description: post.description,
    keywords: post.keywords,
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const html = await marked(post.content);

  return (
    <main className="min-h-screen bg-[#0a0908] text-[#e8e4e0]">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <Link href="/blog" className="text-sm text-[#8a8784] hover:text-[#e8e4e0] transition-colors mb-12 block">
          ← All posts
        </Link>
        <p className="text-xs text-[#8a8784] mb-4 font-mono tracking-widest uppercase">
          {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8 leading-tight">{post.title}</h1>
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div className="mt-16 pt-10 border-t border-[#1e1c1a]">
          <p className="text-sm text-[#8a8784]">
            This post is from the{' '}
            <Link href="/" className="text-[#c9b99a] hover:underline">Studio Method guide</Link>
            {' '}— a practical resource for creative directors running AI-assisted studios.
          </p>
        </div>
      </div>
    </main>
  );
}
