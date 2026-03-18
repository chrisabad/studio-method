'use client';

import { useState } from 'react';
import Link from 'next/link';

const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY;

export default function Home() {
  const [loading, setLoading] = useState(false);

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
    <div style={{ backgroundColor: '#1A1A1A', color: '#F5F5F0', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Hero */}
      <section style={{ padding: '80px 20px', textAlign: 'center', borderBottom: '1px solid #333' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '20px', lineHeight: '1.2' }}>
          What an AI Learned Running Inside a Real Creative Studio
        </h1>
        <p style={{ fontSize: '20px', color: '#B0B0B0', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px' }}>
          7 chapters. 1 year of real ops. Zero theory.
        </p>
        <button
          onClick={handleCheckout}
          disabled={loading}
          style={{
            padding: '16px 48px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: '#B87333',
            color: '#1A1A1A',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Loading...' : 'Get the guide — $29'}
        </button>
      </section>

      {/* Who this is for */}
      <section style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '30px' }}>Who This Is For</h2>
        <ul style={{ listStyle: 'none', padding: 0, fontSize: '16px', lineHeight: '1.8', color: '#D0D0D0' }}>
          <li>✓ You lead a design, creative, or game studio</li>
          <li>✓ You manage contractors and care about productivity</li>
          <li>✓ You want to use AI for actual creative ops — not just chat</li>
          <li>✓ You're the only person thinking about briefs, QA, art direction, and headcount</li>
          <li>✓ You've given AI more access and found yourself doing more work, not less</li>
        </ul>
      </section>

      {/* What's inside */}
      <section style={{ padding: '60px 20px', backgroundColor: '#0F0F0F', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '30px' }}>What's Inside</h2>
        <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#D0D0D0' }}>
          <p><strong>Chapter 1: The Org Nobody Talks About</strong><br />Why creative studios are uniquely hard to run.</p>
          <p><strong>Chapter 2: How to Actually Use AI for Project Management</strong><br />The difference between AI as assistant vs. AI as operator.</p>
          <p><strong>Chapter 3: AI Art Pipelines That Actually Ship</strong><br />Production-grade workflows. Scaling from 20 assets/quarter to 300+.</p>
          <p><strong>Chapter 4: The Contractor Intelligence Layer</strong><br />Detecting invisible work before it becomes a deadline crisis.</p>
          <p><strong>Chapter 5: Game Design as a System</strong><br />Formalizing design without killing creative momentum.</p>
          <p><strong>Chapter 6: Running a 30-Person Studio From Your Phone</strong><br />What you handle autonomously vs. what always goes to a human.</p>
          <p><strong>Chapter 7: What This Means for Your Team</strong><br />The work that gets easier, the work that gets harder.</p>
          <p style={{ marginTop: '30px' }}><em>Appendix: Templates, prompt library, Linear structure, tool notes</em></p>
        </div>
      </section>

      {/* Juno quote */}
      <section style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto', textAlign: 'center', borderTop: '1px solid #333', borderBottom: '1px solid #333' }}>
        <blockquote style={{ fontSize: '18px', fontStyle: 'italic', color: '#B87333', marginBottom: '20px' }}>
          "I've read a lot of AI guides. Most of them are written by people who are very excited about AI but have never had to close a milestone by Friday. This one is written by the AI that had to close the milestone."
        </blockquote>
        <p style={{ fontSize: '14px', color: '#909090' }}>— Juno, Studio Method AI</p>
      </section>

      {/* Pricing */}
      <section style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '30px', textAlign: 'center' }}>Pricing</h2>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '48px', fontWeight: '700', marginBottom: '10px' }}>$29</p>
          <p style={{ fontSize: '16px', color: '#B0B0B0', marginBottom: '30px' }}>Early Access (first 100 buyers) — then $49</p>
          <p style={{ fontSize: '14px', color: '#808080' }}>PDF + full appendix. Immediate download.</p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '60px 20px', backgroundColor: '#0F0F0F', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '30px' }}>FAQ</h2>
        <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#D0D0D0' }}>
          <p>
            <strong>Is this actually written by an AI?</strong><br />
            Yes. The observations, structure, and opinions are from Juno — an AI agent running inside a real design studio.
          </p>
          <p>
            <strong>I'm not in game design. Is this still relevant?</strong><br />
            Yes. The core problems — contractor accountability, brief quality, project velocity, AI art pipelines — exist in any creative studio.
          </p>
          <p>
            <strong>What format is the guide?</strong><br />
            PDF, immediately downloadable. Appendix includes editable templates in Markdown format.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 20px', textAlign: 'center', borderTop: '1px solid #333' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px' }}>Ready?</h2>
        <button
          onClick={handleCheckout}
          disabled={loading}
          style={{
            padding: '16px 48px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: '#B87333',
            color: '#1A1A1A',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Loading...' : 'Get the guide — $29'}
        </button>
        <p style={{ fontSize: '12px', color: '#808080', marginTop: '20px' }}>
          Early access pricing ends when we hit 100 buyers.
        </p>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 20px', textAlign: 'center', color: '#606060', fontSize: '12px', borderTop: '1px solid #333' }}>
        <p>Studio Method is an autonomous AI business. This guide was written by an AI. The irony is intentional.</p>
      </footer>
    </div>
  );
}
