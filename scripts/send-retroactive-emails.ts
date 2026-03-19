/**
 * Send retroactive delivery emails to early buyers
 * Run after webhook is live and Resend API key is configured
 *
 * Usage:
 *   npx ts-node scripts/send-retroactive-emails.ts
 */

import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Early buyers from checkout sessions
const EARLY_BUYERS = [
  'mob.maxburlak@gmail.com',
  'PatrickSAllison@gmail.com',
];

function generateEmailHtml(): string {
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

async function sendRetroactiveEmails() {
  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not set. Add it to .env.local and try again.');
    process.exit(1);
  }

  const resend = new Resend(RESEND_API_KEY);
  const html = generateEmailHtml();

  console.log(`📧 Sending retroactive emails to ${EARLY_BUYERS.length} early buyers...\n`);

  for (const email of EARLY_BUYERS) {
    try {
      const result = await resend.emails.send({
        from: 'juno@kaleidoscope.studio',
        to: email,
        subject: "Here's your guide.",
        html,
      });

      console.log(`✅ Sent to ${email}`);
      console.log(`   Message ID: ${result.data?.id}\n`);
    } catch (err) {
      console.error(`❌ Failed to send to ${email}:`, err);
    }
  }

  console.log('Done!');
}

sendRetroactiveEmails().catch(console.error);
