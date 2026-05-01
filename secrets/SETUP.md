# GSC API Credentials Setup

This directory should contain the Google Cloud service account key file for
GSC API access. The actual key file is **never** committed to git.

## Setup Instructions

### 1. Create a GCP Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing): `studiomethod-gsc`
3. Enable the **Google Search Console API**:
   - Navigate to APIs & Services → Library
   - Search for "Google Search Console API"
   - Click Enable

### 2. Create Service Account

1. Navigate to IAM & Admin → Service Accounts
2. Click **Create Service Account**
   - Name: `gsc-readonly`
   - Description: `Read-only access for automated GSC reporting`
3. Click **Create and Continue**
4. Skip the optional roles (not needed for GSC)
5. Click **Done**

### 3. Generate JSON Key

1. Click the service account you just created
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Select **JSON** format
5. Click **Create** — this downloads the key file
6. Save it as `secrets/gsc-key.json` in this repo (already gitignored)

### 4. Grant GSC Access

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select the `studiomethod.ai` property
3. Go to **Settings** → **Users and permissions**
4. Click **Add user**
5. Enter the service account email (e.g., `gsc-readonly@studiomethod-gsc.iam.gserviceaccount.com`)
6. Select **Full** or **Restricted** (Restricted = read-only, which is sufficient)
7. Click **Add user**

### 5. Configure Environment

```bash
# Set the env var (add to .env.local or your deployment config)
export GSC_KEY_FILE=secrets/gsc-key.json
export GSC_SITE_URL=https://studiomethod.ai
```

For Vercel deployment:
```bash
vercel env add GSC_KEY_FILE
# Value: secrets/gsc-key.json

# For the actual key contents, use a Vercel secret:
vercel env add GSC_KEY_JSON
# Value: <paste the entire JSON key contents>
```

### 6. Verify

```bash
python3 scripts/gsc-weekly-report.py
```

If configured correctly, this will authenticate and produce a report (note:
GSC data takes 2-4 days to appear after initial verification, so early reports
may show no data).

## Weekly Cron (Local)

Add to crontab for weekly Friday reports:

```bash
0 9 * * 5 cd /path/to/studio-method && GSC_KEY_FILE=secrets/gsc-key.json python3 scripts/gsc-weekly-report.py >> reports/gsc/cron.log 2>&1
```

## Notes

- The service account key file (`gsc-key.json`) is gitignored and must NEVER be committed
- GSC data has a ~2 day lag; reports automatically offset by 2 days
- After initial GSC property verification, data takes 2-4 weeks to populate
- The script outputs markdown reports to `reports/gsc/`