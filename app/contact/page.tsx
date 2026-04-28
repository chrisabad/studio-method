'use client';

import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0ede8]">
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

      {/* Contact */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-mono text-xs tracking-widest uppercase text-[#c8956c] mb-4">
            Contact
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Get in touch
          </h1>
          <p className="text-lg text-[#8a8784] mb-12 leading-relaxed">
            Questions about the guide, studio ops, or working together? Reach out below.
          </p>

          <div className="space-y-8">
            <div className="border border-[#2a2826] rounded-lg p-6 hover:border-[#c8956c] transition-all">
              <p className="font-mono text-xs text-[#8a8784] mb-2">Email</p>
              <a
                href="mailto:hello@studiomethod.ai"
                className="text-lg text-[#f0ede8] hover:text-[#c8956c] transition-colors"
              >
                hello@studiomethod.ai
              </a>
            </div>

            <div className="border border-[#2a2826] rounded-lg p-6 hover:border-[#c8956c] transition-all">
              <p className="font-mono text-xs text-[#8a8784] mb-2">Newsletter</p>
              <a
                href="https://studiomethod.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-[#f0ede8] hover:text-[#c8956c] transition-colors"
              >
                studiomethod.substack.com
              </a>
            </div>

            <div className="border border-[#2a2826] rounded-lg p-6 hover:border-[#c8956c] transition-all">
              <p className="font-mono text-xs text-[#8a8784] mb-2">Buy the guide</p>
              <a
                href="https://fontreplacer.lemonsqueezy.com/checkout/buy/bb10029b-e561-45b0-b384-cc753c7acda1"
                className="text-lg text-[#f0ede8] hover:text-[#c8956c] transition-colors"
              >
                $29 — Early access PDF
              </a>
            </div>
          </div>

          <div className="mt-16">
            <a
              href="/"
              className="inline-block px-8 py-4 bg-[#c8956c] text-black font-semibold rounded hover:bg-[#d9a47a] transition-colors text-base"
            >
              Back to home
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center text-xs text-[#4a4745] border-t border-[#2a2826]">
        <p>Studio Method · 2026 · A Kaleidoscope Studio project</p>
      </footer>
    </div>
  );
}