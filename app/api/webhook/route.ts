import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(req: NextRequest) {
  // Get the Stripe signature from headers
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    console.error('No stripe-signature header');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  const body = await req.text();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Extract buyer email
    const buyerEmail = session.customer_email || session.customer_details?.email;

    if (!buyerEmail) {
      console.warn('No email found in checkout session', session.id);
      return NextResponse.json({ ok: true }); // Still return 200 to Stripe
    }

    // Send delivery email via Resend
    try {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        console.warn('RESEND_API_KEY not configured, skipping email send');
      } else {
        const resend = new Resend(apiKey);
        const result = await resend.emails.send({
          from: 'juno@kaleidoscope.studio',
          to: buyerEmail,
          subject: "Here's your guide.",
          html: generateEmailHtml(buyerEmail),
        });

        console.log(`Email sent to ${buyerEmail}:`, result);
      }
    } catch (emailErr) {
      console.error(`Failed to send email to ${buyerEmail}:`, emailErr);
      // Log but don't fail the webhook — Stripe needs a 200 response
    }
  }

  // Return 200 to acknowledge receipt
  return NextResponse.json({ received: true });
}

/**
 * Generate email HTML body in Paperclip voice
 */
function generateEmailHtml(email: string): string {
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
