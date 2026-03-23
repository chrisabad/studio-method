import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { Resend } from 'resend';

/**
 * LemonSqueezy Webhook Handler
 *
 * Listens for `order_created` events (status=paid) from LemonSqueezy
 * and sends a delivery email to the buyer via Resend.
 *
 * Verification: HMAC-SHA256 of raw request body using LEMON_SQUEEZY_WEBHOOK_SECRET,
 * compared against the `X-Signature` header.
 *
 * Env vars required:
 *   LEMON_SQUEEZY_WEBHOOK_SECRET  — signing secret from LemonSqueezy dashboard
 *   RESEND_API_KEY                — Resend API key for sending delivery emails
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-signature');

  if (!signature) {
    console.error('[webhook] Missing X-Signature header');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

  if (!secret) {
    console.error('[webhook] LEMON_SQUEEZY_WEBHOOK_SECRET not configured');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  // Verify HMAC-SHA256 signature
  const expectedSig = createHmac('sha256', secret).update(rawBody).digest('hex');
  if (expectedSig !== signature) {
    console.error('[webhook] Signature mismatch');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    console.error('[webhook] Failed to parse JSON body');
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventName = (payload.meta as Record<string, unknown>)?.event_name as string | undefined;
  console.log(`[webhook] Event received: ${eventName}`);

  // Only handle completed orders
  if (eventName === 'order_created') {
    const data = payload.data as Record<string, unknown> | undefined;
    const attributes = data?.attributes as Record<string, unknown> | undefined;

    // Only process paid orders (guard against test/refunded events)
    const status = attributes?.status as string | undefined;
    if (status !== 'paid') {
      console.log(`[webhook] Skipping order with status: ${status}`);
      return NextResponse.json({ received: true });
    }

    const buyerEmail = attributes?.user_email as string | undefined;

    if (!buyerEmail) {
      console.warn('[webhook] No user_email in order attributes', data);
      return NextResponse.json({ ok: true }); // Return 200 — don't block LemonSqueezy
    }

    const buyerName = attributes?.user_name as string | undefined;
    const orderId = data?.id as string | undefined;
    console.log(`[webhook] Processing order ${orderId} for ${buyerEmail}`);

    // Send delivery email via Resend
    try {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        console.warn('[webhook] RESEND_API_KEY not configured, skipping email');
      } else {
        const resend = new Resend(apiKey);
        const result = await resend.emails.send({
          from: 'juno@kaleidoscope.studio',
          to: buyerEmail,
          subject: "Here's your guide.",
          html: generateEmailHtml(buyerName || buyerEmail),
        });
        console.log(`[webhook] Email sent to ${buyerEmail}:`, result);
      }
    } catch (emailErr) {
      console.error(`[webhook] Failed to send email to ${buyerEmail}:`, emailErr);
      // Log but don't fail — LemonSqueezy needs a 200 response
    }
  }

  return NextResponse.json({ received: true });
}

/**
 * Delivery email HTML — Paperclip voice
 */
function generateEmailHtml(nameOrEmail: string): string {
  const firstName = nameOrEmail.includes('@') ? '' : nameOrEmail.split(' ')[0];
  const greeting = firstName ? `Hey ${firstName},` : 'Hey,';

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { margin-bottom: 30px; }
      h1 { font-size: 24px; margin: 0 0 10px 0; }
      p { line-height: 1.6; margin: 15px 0; }
      .cta-button { display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; font-weight: 500; }
      .footer { color: #999; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Here's your guide.</h1>
      </div>

      <p>${greeting}</p>

      <p>Thanks for picking up <em>The Creative Director's AI Playbook</em>. You've got access to the real operating system we built to run a creative studio with AI at the core.</p>

      <p>7 chapters covering:</p>
      <ul>
        <li>How to structure creative work so AI actually helps</li>
        <li>Building contractor briefing templates that produce consistent output</li>
        <li>Quality gates and validation checkpoints</li>
        <li>Scaling from 20 assets/quarter to 300+</li>
        <li>Tokenization strategies for art direction</li>
        <li>Real project examples and what worked (and what didn't)</li>
        <li>Hands-on prompt library for production workflows</li>
      </ul>

      <p>This isn't theory. Every framework is tested in a real studio, managing 25–30 people, shipping titles monthly.</p>

      <a href="https://studiomethod.ai/guide.pdf" class="cta-button">Download the guide (PDF)</a>

      <p style="margin-top: 30px; font-size: 14px;">Questions or feedback? Reply to this email — I read everything.</p>

      <div class="footer">
        <p>Sent by <a href="https://kaleidoscope.studio" style="color: #999;">Kaleidoscope</a> via <a href="https://studiomethod.ai" style="color: #999;">Studio Method</a></p>
        <p style="margin-top: 10px;">You received this because you purchased The Creative Director's AI Playbook.</p>
      </div>
    </div>
  </body>
</html>
  `;
}
