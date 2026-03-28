'use client';

import { track } from '@vercel/analytics';
import Link from 'next/link';

const LEMON_CHECKOUT_URL = 'https://fontreplacer.lemonsqueezy.com/checkout/buy/bb10029b-e561-45b0-b384-cc753c7acda1';

export default function PricingPage() {
  const handleCheckout = () => {
    track('buy_button_clicked');
    window.location.href = LEMON_CHECKOUT_URL;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0ede8]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Nav */}
      <nav className="border-b border-[#2a2826] px-6 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xs font-bold tracking-widest uppercase text-[#f0ede8] no-underline hover:text-[#c8956c] transition-colors">
            Studio Method
          </Link>
          <Link href="/" className="text-xs text-[#8a8784] hover:text-[#f0ede8] transition-colors">
            ← Back
          </Link>
        </div>
      </nav>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-mono text-xs tracking-widest uppercase text-[#c8956c] mb-4">
              Pricing
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              The Creative Director's AI Playbook
            </h1>
            <p className="text-lg text-[#8a8784] max-w-2xl mx-auto">
              7 chapters. 1 year of real ops. Written by the AI that ran inside a real creative studio.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-[#111111] border border-[#2a2826] rounded-lg p-8 md:p-10">
            <div className="text-center mb-6">
              <p className="text-5xl md:text-6xl font-bold mb-2">$29</p>
              <p className="text-sm text-[#8a8784]">
                Early access price — reg. <span className="line-through">$49</span>
              </p>
            </div>

            <ul className="space-y-3 text-sm text-[#d0d0d0] mb-8">
              {[
                'PDF guide (7 chapters)',
                'Markdown templates (editable)',
                'Prompt library — 20 production-tested prompts',
                'Linear setup guide',
                'Lifetime access + future updates',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-[#c8956c]">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={handleCheckout}
              className="w-full px-6 py-4 bg-[#c8956c] text-black font-semibold rounded hover:bg-[#d9a47a] transition-colors text-base"
            >
              Get early access — $29
            </button>

            <p className="text-xs text-[#4a4745] mt-4 text-center">
              100 early-access spots. 30-day satisfaction guarantee.
            </p>
          </div>

          {/* What's inside */}
          <div className="mt-16 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-6 text-center">What's inside</h2>
            <div className="space-y-3 text-sm text-[#8a8784]">
              {[
                ['01', "The Org Nobody Talks About", "Why creative studios are uniquely hard to run."],
                ['02', "How to Actually Use AI for Project Management", "AI as assistant vs. AI as operator."],
                ['03', "AI Art Pipelines That Actually Ship", "Scaling from 20 assets/quarter to 300+."],
                ['04', "The Contractor Intelligence Layer", "Detecting invisible work before it becomes a crisis."],
                ['05', "Game Design as a System", "Formalizing design without killing creative momentum."],
                ['06', "Running a 30-Person Studio From Your Phone", "What you handle autonomously vs. what goes to a human."],
                ['07', "What This Means for Your Team", "The work that gets easier, the work that gets harder."],
              ].map(([num, title, desc], i) => (
                <div key={i} className="border border-[#2a2826] rounded p-4 flex gap-4">
                  <span className="font-mono text-xs text-[#4a4745] font-bold w-6 shrink-0 pt-0.5">{num}</span>
                  <div>
                    <p className="font-semibold text-[#d0d0d0] mb-1">{title}</p>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-16">
            <button
              onClick={handleCheckout}
              className="px-10 py-4 bg-[#c8956c] text-black font-semibold rounded hover:bg-[#d9a47a] transition-colors text-base"
            >
              Get the guide — $29
            </button>
            <p className="text-xs text-[#4a4745] mt-3">Instant PDF download after purchase.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
