import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Studio Method',
  description: 'Practical writing on creative studio operations, AI workflows, and contractor management.',
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-[#0a0908] text-[#e8e4e0]">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <Link href="/" className="text-sm text-[#8a8784] hover:text-[#e8e4e0] transition-colors mb-12 block">
          ← Studio Method
        </Link>
        <h1 className="font-serif text-4xl font-bold mb-4">Writing</h1>
        <p className="text-[#8a8784] mb-16 text-lg">
          On creative studio operations, AI workflows, and contractor management.
        </p>
        {posts.length === 0 ? (
          <p className="text-[#8a8784]">Posts coming soon.</p>
        ) : (
          <ul className="space-y-10">
            {posts.map(post => (
              <li key={post.slug} className="border-b border-[#1e1c1a] pb-10">
                <Link href={`/blog/${post.slug}`} className="group block">
                  <p className="text-xs text-[#8a8784] mb-2 font-mono tracking-widest uppercase">
                    {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <h2 className="text-xl font-bold mb-2 group-hover:text-[#c9b99a] transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-[#8a8784] text-sm leading-relaxed">{post.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
