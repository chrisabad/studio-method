# Stripe Webhook + Resend Email Integration Setup

## Status
✅ **Code complete** — webhook handler and email template built  
⏳ **Secrets needed** — Stripe webhook secret + Resend API key  
⏳ **Not deployed** — waiting for env vars to be added to Vercel

---

## What Was Built

### 1. **Webhook Handler** (`/app/api/webhook/route.ts`)
- Listens for Stripe `checkout.session.completed` events
- Verifies Stripe signature using webhook secret
- Extracts buyer email from session
- Calls Resend API to send delivery email
- Returns 200 to Stripe for acknowledgment
- Gracefully handles missing API keys (logs warning, continues)

### 2. **Email Template** (in handler)
- **From:** `juno@kaleidoscope.studio`
- **Subject:** "Here's your guide."
- **Body:** Paperclip voice — friendly, direct, focused on value
  - 7-chapter summary
  - Download link to `https://studiomethod.ai/guide.pdf`
  - Reply-to context
  - Footer with branding

### 3. **Retroactive Email Script** (`/scripts/send-retroactive-emails.ts`)
- One-off tool to send delivery emails to early buyers
- Targets: `mob.maxburlak@gmail.com` and `PatrickSAllison@gmail.com`
- Run after webhook is live and API key is configured

### 4. **Updated `.env` template**
- Placeholders for `RESEND_API_KEY` and `STRIPE_WEBHOOK_SECRET`
- Clear instructions on where to get each secret

---

## Required Secrets (TODO)

| Secret | Where to Get | Add To |
|--------|-------------|---------|
| `RESEND_API_KEY` | Resend dashboard → API Keys | `.env.local` + Vercel project env vars |
| `STRIPE_WEBHOOK_SECRET` | Stripe dashboard → Settings → Webhooks → [webhook endpoint] → Signing secret | `.env.local` + Vercel project env vars |

---

## Deployment Steps (Next)

### Step 1: Get Resend API Key
1. Go to [resend.com/api-keys](https://resend.com/api-keys)
2. Copy the **API key** (format: `re_1234...`)
3. Add to `.env.local` in repo root:
   ```
   RESEND_API_KEY=re_...
   ```

### Step 2: Create Stripe Webhook Endpoint
1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Settings** → **Webhooks**
2. Click **Add endpoint**
3. Set URL to: `https://studiomethod.ai/api/webhook`
4. Select events: **checkout.session.completed**
5. Click **Add endpoint**
6. Click the new endpoint to reveal the **Signing secret** (format: `whsec_...`)
7. Add to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Step 3: Deploy to Vercel
1. Commit webhook code:
   ```bash
   git add app/api/webhook/route.ts scripts/send-retroactive-emails.ts .env
   git commit -m "feat: add Stripe webhook + Resend email integration"
   git push
   ```
2. Vercel auto-deploys on push
3. After deploy: Go to Vercel project dashboard → **Settings** → **Environment Variables**
4. Add both secrets:
   - `RESEND_API_KEY` = `re_...`
   - `STRIPE_WEBHOOK_SECRET` = `whsec_...`
5. Redeploy to apply env vars (or push an empty commit)

### Step 4: Test Webhook
1. Make a test purchase on **studiomethod.ai** (use Stripe test mode first if possible, or a real test card)
2. Check your email for delivery email within 60 seconds
3. Verify link works: click "Download the guide (PDF)" → should download from `https://studiomethod.ai/guide.pdf`
4. Check Vercel logs for any errors:
   ```bash
   vercel logs studiomethod-site --tail
   ```

### Step 5: Send Retroactive Emails
After webhook is live and verified:
```bash
# Add Resend API key to .env.local if not already there
npx ts-node scripts/send-retroactive-emails.ts
```

---

## Testing Checklist

- [ ] Stripe webhook endpoint created and signing secret saved
- [ ] Resend API key obtained and env vars set
- [ ] Code deployed to Vercel
- [ ] Test purchase made → delivery email received within 60s
- [ ] Download link in email works
- [ ] Retroactive emails sent to early buyers
- [ ] Vercel logs show no errors

---

## Troubleshooting

### Webhook returns 400 "Invalid signature"
- Check that `STRIPE_WEBHOOK_SECRET` is correct (should start with `whsec_`)
- Verify it matches the signing secret in Stripe dashboard
- If not matching, regenerate webhook endpoint in Stripe

### Email not sending
- Check that `RESEND_API_KEY` is set and correct (should start with `re_`)
- Check Resend dashboard → recent emails → verify delivery status
- Verify `juno@kaleidoscope.studio` is a verified sender in Resend
  - If not, add to verified domains or senders in Resend dashboard

### PDF download link broken
- Ensure `guide.pdf` exists at `https://studiomethod.ai/guide.pdf`
- Check public folder structure in repo
- Verify Vercel deployment includes the PDF file

---

## Notes

- Webhook silently logs email send failures to Stripe logs (doesn't fail the webhook response)
- Email template is responsive and works on mobile
- Both Stripe and Resend support retry logic — if email fails, Resend retries for 48 hours
- Webhook secret is critical; treat like an API key
- Test purchases can be made with Stripe test cards (e.g., `4242 4242 4242 4242`)
