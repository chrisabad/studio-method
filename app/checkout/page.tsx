'use client';

import { useEffect } from 'react';
import { track } from '@vercel/analytics';

const LEMON_CHECKOUT_URL = 'https://fontreplacer.lemonsqueezy.com/checkout/buy/bb10029b-e561-45b0-b384-cc753c7acda1';

export default function CheckoutPage() {
  useEffect(() => {
    track('checkout_redirect');
    window.location.href = LEMON_CHECKOUT_URL;
  }, []);

  return (
    <div
      style={{
        backgroundColor: '#0a0a0a',
        color: '#f0ede8',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <p style={{ fontSize: '14px', color: '#8a8784', marginBottom: '8px' }}>
          Redirecting to checkout…
        </p>
        <p style={{ fontSize: '12px', color: '#4a4745' }}>
          If you are not redirected,{' '}
          <a
            href={LEMON_CHECKOUT_URL}
            style={{ color: '#c8956c', textDecoration: 'none' }}
          >
            click here
          </a>
          .
        </p>
      </div>
    </div>
  );
}
