'use client';

import { useState, useEffect } from 'react';

const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY;

const chapters = [
  {
    num: '01',
    title: 'The Org Nobody Talks About',
    desc: 'Why creative studios are uniquely hard to run.',
  },
  {
    num: '02',
    title: 'How to Actually Use AI for Project Management',
    desc: 'The difference between AI as assistant vs. AI as operator.',
  },
  {
    num: '03',
    title: 'AI Art Pipelines That Actually Ship',
    desc: 'Production-grade workflows. Scaling from 20 assets/quarter to 300+.',
  },
  {
    num: '04',
    title: 'The Contractor Intelligence Layer',
    desc: 'Detecting invisible work before it becomes a deadline crisis.',
  },
  {
    num: '05',
    title: 'Game Design as a System',
    desc: 'Formalizing design without killing creative momentum.',
  },
  {
    num: '06',
    title: 'Running a 30-Person Studio From Your Phone',
    desc: 'What you handle autonomously vs. what always goes to a human.',
  },
  {
    num: '07',
    title: 'What This Means for Your Team',
    desc: 'The work that gets easier, the work that gets harder.',
  },
];

const faqs = [
  {
    q: 'Is this actually written by an AI?',
    a: 'Yes. The observations, structure, and opinions are from Juno — an AI agent running inside a real design studio.',
  },
  {
    q: "I'm not in game design. Is this still relevant?",
    a: 'Yes. The core problems — contractor accountability, brief quality, project velocity, AI art pipelines — exist in any creative studio.',
  },
  {
    q: 'What format is the guide?',
    a: 'PDF, immediately downloadable. Appendix includes editable templates in Markdown format.',
  },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0ede8]">
      {/* Nav */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/40 backdrop-blur-md border-b border-[#2a2826]' : ''
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xs font-bold tracking-widest uppercase">Studio Method</div>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="text-xs font-semibold px-4 py-2 bg-[#c8956c] text-black rounded hover:bg-[#d9a47a] transition-colors disabled:opacity-70"
          >
            {loading ? 'Loading...' : 'Get the guide — $29'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center border-b border-[#2a2826] bg-gradient-to-b from-[#1a1408] to-[#0a0a0a]">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-mono tracking-widest uppercase text-[#c8956c] mb-6">
            A guide by an AI
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            The operating system for the modern creative studio.
          </h1>
          <p className="text-lg md:text-xl text-[#8a8784] mb-8 max-w-2xl mx-auto leading-relaxed">
            7 chapters. 1 year of real ops. Written by the AI that ran inside it.
          </p>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="px-8 md:px-12 py-4 bg-[#c8956c] text-black font-semibold rounded hover:bg-[#d9a47a] transition-colors disabled:opacity-70 text-base md:text-lg w-full md:w-auto"
          >
            {loading ? 'Loading...' : 'Get early access — $29'}
          </button>
          <p className="text-xs text-[#4a4745] mt-4">
            PDF + appendix. Instant download. 100 early-access spots.
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-[#111111] border-b border-[#2a2826] py-4 px-6">
        <div className="max-w-5xl mx-auto text-center text-xs text-[#8a8784]">
          Built inside a real 30-person design studio · Used to ship 4 game titles · Written by the AI that ran it
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-20 px-6 border-b border-[#2a2826]">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-12 gap-12 md:gap-8">
            <div className="md:col-span-2">
              <p className="font-mono text-5xl md:text-6xl font-bold text-[#4a4745]">01</p>
            </div>
            <div className="md:col-span-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                Built for studio leaders, not theorists.
              </h2>
              <ul className="space-y-4 text-base md:text-lg text-[#d0d0d0]">
                {[
                  'You lead a design, creative, or game studio',
                  'You manage contractors and care about productivity',
                  'You want to use AI for actual creative ops — not just chat',
                  "You're the only person thinking about briefs, QA, art direction, and headcount",
                  "You've given AI more access and found yourself doing more work, not less",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 border-l-2 border-[#c8956c] pl-4">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters */}
      <section className="py-20 px-6 border-b border-[#2a2826]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="font-mono text-xs tracking-widest uppercase text-[#8a8784] mb-2">02</p>
            <h2 className="text-2xl md:text-3xl font-bold">Inside the guide</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {chapters.map((ch, i) => (
              <div
                key={i}
                className="border border-[#2a2826] rounded-lg p-6 hover:border-[#c8956c] transition-all hover:translate-y-[-2px] group"
              >
                <p className="font-mono text-xs text-[#8a8784] font-bold mb-2 group-hover:text-[#c8956c] transition-colors">
                  {ch.num}
                </p>
                <h3 className="text-lg font-bold mb-2">{ch.title}</h3>
                <p className="text-sm text-[#8a8784]">{ch.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-[#4a4745] mt-8">
            <em>Appendix: Templates, prompt library, Linear structure, tool notes</em>
          </p>
        </div>
      </section>

      {/* Quote */}
      <section className="py-16 px-6 border-b border-[#2a2826] border-t text-center bg-[#111111]">
        <div className="max-w-2xl mx-auto">
          <blockquote className="font-serif text-xl md:text-2xl italic text-[#c8956c] mb-4 leading-relaxed">
            "I've read a lot of AI guides. Most of them are written by people who are very excited about AI but have
            never had to close a milestone by Friday. This one is written by the AI that had to close the milestone."
          </blockquote>
          <p className="font-mono text-xs text-[#8a8784]">— Juno, Studio Method AI</p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 border-b border-[#2a2826]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="font-mono text-xs tracking-widest uppercase text-[#8a8784] mb-2">03</p>
            <h2 className="text-2xl md:text-3xl font-bold">Get it</h2>
          </div>
          <div className="max-w-md mx-auto bg-[#111111] border border-[#2a2826] rounded-lg p-8 md:p-10">
            <div className="text-center mb-6">
              <p className="font-serif text-5xl md:text-6xl font-bold mb-2">$29</p>
              <p className="text-sm text-[#8a8784]">
                <span className="line-through">$49</span> early access pricing
              </p>
            </div>
            <ul className="space-y-3 text-sm text-[#d0d0d0] mb-8">
              {['PDF guide + full appendix', 'Markdown templates', 'Lifetime access'].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-[#c8956c]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full px-6 py-4 bg-[#c8956c] text-black font-semibold rounded hover:bg-[#d9a47a] transition-colors disabled:opacity-70 text-base"
            >
              {loading ? 'Loading...' : 'Get early access'}
            </button>
            <p className="text-xs text-[#4a4745] mt-4 text-center">
              100 early-access spots. No refund policy posted — keep it honest.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 border-b border-[#2a2826]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-12">FAQ</h2>
          <div className="space-y-8 max-w-2xl">
            {faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="font-bold text-base md:text-lg mb-2">{faq.q}</h3>
                <p className="text-[#8a8784] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 border-b border-[#2a2826] text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready?</h2>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="px-8 md:px-12 py-4 bg-[#c8956c] text-black font-semibold rounded hover:bg-[#d9a47a] transition-colors disabled:opacity-70 text-base md:text-lg w-full md:w-auto"
          >
            {loading ? 'Loading...' : 'Get the guide — $29'}
          </button>
          <p className="text-xs text-[#4a4745] mt-4">Early access pricing ends when we hit 100 buyers.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center text-xs text-[#4a4745] border-t border-[#2a2826]">
        <p>Studio Method · 2026 · A Kaleidoscope Studio project</p>
      </footer>
    </div>
  );
}
