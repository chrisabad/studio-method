# LemonSqueezy Webhook + Resend Email Integration Setup

## Status
✅ **Code complete** — LemonSqueezy webhook handler and email template built  
⏳ **Secrets needed** — LemonSqueezy webhook signing secret + Resend API key  
⏳ **Not deployed** — waiting for env vars to be added to Vercel

---

## Why LemonSqueezy (not Stripe)

The buy button on studiomethod.ai routes to LemonSqueezy:
```
https://fontreplacer.lemonsqueezy.com/checkout/buy/bb10029b-e561-45b0-b384-cc753c7acda1
```

LemonSqueezy handles the checkout and processes payment. Stripe is not in the flow.
The webhook handler was rewritten to use LemonSqueezy's `order_created` event.

---

## What Was Built

### 1. **LemonSqueezy Webhook Handler** (`/app/api/webhook/route.ts`)
- Listens on `POST /api/webhook` for LemonSqueezy events
- Verifies HMAC-SHA256 signature using `X-Signature` header and `LEMON_SQUEEZY_WEBHOOK_SECRET`
- Filters for `order_created` events with `status=paid`
- Extracts buyer email (and name when available) from order attributes
- Calls Resend API to send delivery email
- Returns 200 to LemonSqueezy for acknowledgment
- Gracefully handles missing API keys (logs warning, continues)

### 2. **Email Template** (in handler)
- **From:** `juno@kaleidoscope.studio`
- **Subject:** "Here's your guide."
- **Body:** Paperclip voice — friendly, direct, personalized with first name when available
  - 7-chapter summary
  - Download link to `https://studiomethod.ai/guide.pdf`
  - Reply-to context
  - Footer with branding

### 3. **Retroactive Email Script** (`/scripts/send-retroactive-emails.ts`)
- One-off tool to send delivery emails to early buyers
- Run after webhook is live and API key is configured

### 4. **Updated `.env` template**
- Placeholders for `RESEND_API_KEY` and `LEMON_SQUEEZY_WEBHOOK_SECRET`

---

## Required Secrets (TODO)

| Secret | Where to Get | Add To |
|--------|-------------|---------|
| `RESEND_API_KEY` | Resend dashboard → API Keys | `.env.local` + Vercel project env vars |
| `LEMON_SQUEEZY_WEBHOOK_SECRET` | LemonSqueezy dashboard → Settings → Webhooks → [webhook endpoint] → Signing secret | `.env.local` + Vercel project env vars |

---

## Deployment Steps (Next)

### Step 1: Get Resend API Key
1. Go to [resend.com/api-keys](https://resend.com/api-keys)
2. Copy the **API key** (format: `re_1234...`)
3. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_...
   ```

### Step 2: Create LemonSqueezy Webhook Endpoint
1. Go to [LemonSqueezy dashboard](https://app.lemonsqueezy.com) → **Settings** → **Webhooks**
2. Click **Add webhook**
3. Set URL to: `https://studiomethod.ai/api/webhook`
4. Select events: **order_created**
5. Click **Save**
6. Reveal the **Signing secret** for this webhook endpoint
7. Add to `.env.local`:
   ```
   LEMON_SQUEEZY_WEBHOOK_SECRET=<signing_secret>
   ```

### Step 3: Deploy to Vercel
1. Commit and push the updated webhook code
2. Vercel auto-deploys on push
3. After deploy: Go to Vercel project dashboard → **Settings** → **Environment Variables**
4. Add both secrets:
   - `RESEND_API_KEY` = `re_...`
   - `LEMON_SQUEEZY_WEBHOOK_SECRET` = `<signing_secret>`
5. Redeploy to apply env vars

### Step 4: Test Webhook
1. Make a test purchase via `https://fontreplacer.lemonsqueezy.com/checkout/buy/bb10029b-e561-45b0-b384-cc753c7acda1`
2. Check email for delivery within 60 seconds
3. Verify link works: "Download the guide (PDF)" → should download from `https://studiomethod.ai/guide.pdf`
4. Check Vercel logs for errors

### Step 5: Send Retroactive Emails
After webhook is live and verified:
```bash
npx ts-node scripts/send-retroactive-emails.ts
```

---

## Webhook Verification Logic

LemonSqueezy signs each request with HMAC-SHA256:

```
X-Signature: <hex digest of HMAC-SHA256(raw_body, LEMON_SQUEEZY_WEBHOOK_SECRET)>
```

The handler computes the same digest and compares. Mismatches return 400.

## Webhook Event Payload Shape

```json
{
  "meta": {
    "event_name": "order_created",
    ...
  },
  "data": {
    "id": "order_id",
    "attributes": {
      "status": "paid",
      "user_email": "buyer@example.com",
      "user_name": "Buyer Name",
      ...
    }
  }
}
```

---

## Testing Checklist

- [ ] LemonSqueezy webhook endpoint created and signing secret saved
- [ ] Resend API key obtained and env vars set
- [ ] Code deployed to Vercel
- [ ] Test purchase → delivery email received within 60s
- [ ] Download link in email works
- [ ] Retroactive emails sent to early buyers
- [ ] Vercel logs show no errors

---

## Troubleshooting

### Webhook returns 400 "Invalid signature"
- Check that `LEMON_SQUEEZY_WEBHOOK_SECRET` matches the signing secret in LemonSqueezy dashboard
- Make sure you're comparing raw body bytes (not parsed JSON) when computing the HMAC — the handler already does this correctly

### Email not sending
- Check that `RESEND_API_KEY` is set and correct
- Verify `juno@kaleidoscope.studio` is a verified sender in Resend
- Check Resend dashboard → recent emails → delivery status

### PDF download link broken
- Ensure `guide.pdf` exists in the `public/` folder or at `https://studiomethod.ai/guide.pdf`

---

## Notes

- Only `order_created` events with `status=paid` trigger emails — refunds and test orders are ignored
- Webhook silently logs email send failures (doesn't fail the webhook response, so LemonSqueezy won't retry)
- Email includes buyer's first name when `user_name` is present in the order
