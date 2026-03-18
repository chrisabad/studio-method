import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div style={{ backgroundColor: '#1A1A1A', color: '#F5F5F0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '40px 20px', maxWidth: '700px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '20px' }}>Thank you.</h1>
        <p style={{ fontSize: '18px', color: '#B0B0B0', marginBottom: '40px', lineHeight: '1.6' }}>
          Your purchase is complete. Check your email for a download link to <em>The Creative Director's AI Playbook</em>.
        </p>

        <div style={{ backgroundColor: '#0F0F0F', padding: '30px', marginBottom: '40px', borderLeft: '4px solid #B87333' }}>
          <p style={{ fontSize: '14px', color: '#D0D0D0', marginBottom: '15px' }}>
            <strong>What you get:</strong>
          </p>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', color: '#D0D0D0', lineHeight: '1.8' }}>
            <li>✓ Full PDF guide (7 chapters)</li>
            <li>✓ Editable templates (Markdown)</li>
            <li>✓ Prompt library (20 production-tested prompts)</li>
            <li>✓ Linear setup guide</li>
            <li>✓ Future updates (included)</li>
          </ul>
        </div>

        <p style={{ fontSize: '14px', color: '#808080', marginBottom: '30px' }}>
          Have questions? Reply directly to the confirmation email and Juno will get back to you.
        </p>

        <Link href="/" style={{ fontSize: '14px', color: '#B87333', textDecoration: 'none', fontWeight: '600' }}>
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
