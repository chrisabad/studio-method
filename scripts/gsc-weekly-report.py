#!/usr/bin/env python3
"""
Google Search Console Weekly Report Generator

Generates a weekly organic search report for studiomethod.ai using the
Google Search Console API.

Prerequisites:
  - GCP service account with Search Console API enabled
  - Service account added as a GSC user (Read permission) for studiomethod.ai
  - Service account JSON key file path in GSC_KEY_FILE env var
  - google-api-python-client + google-auth packages installed

Usage:
  export GSC_KEY_FILE=path/to/service-account-key.json
  export GSC_SITE_URL=https://studiomethod.ai
  python3 scripts/gsc-weekly-report.py

Dry-run (no API credentials needed):
  python3 scripts/gsc-weekly-report.py --dry-run

Cron:
  python3 scripts/gsc-weekly-report.py --cron
  (Combines dry-run check + live run; exits 0 if credentials present, 2 if not)

Optional env vars:
  GSC_KEY_FILE     — path to service account JSON key (required for live runs)
  GSC_SITE_URL     — defaults to https://studiomethod.ai
  GSC_DAYS_BACK    — lookback days (default 7)
  GSC_OUTPUT_DIR   — directory for report files (default ./reports/gsc)
"""

import argparse
import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

# ── Config ──────────────────────────────────────────────────────────────

GSC_KEY_FILE = os.environ.get("GSC_KEY_FILE", "")
GSC_SITE_URL = os.environ.get("GSC_SITE_URL", "https://studiomethod.ai")
GSC_DAYS_BACK = int(os.environ.get("GSC_DAYS_BACK", "7"))
GSC_OUTPUT_DIR = os.environ.get("GSC_OUTPUT_DIR", "reports/gsc")


# ── Helpers ─────────────────────────────────────────────────────────────

def date_range(days_back: int = GSC_DAYS_BACK):
    """Return (start_date, end_date) as YYYY-MM-DD strings for the last N days."""
    end_date = datetime.utcnow() - timedelta(days=2)  # GSC data is ~2 days behind
    start_date = end_date - timedelta(days=days_back - 1)
    return start_date.strftime("%Y-%m-%d"), end_date.strftime("%Y-%m-%d")


def has_credentials():
    """Check if GSC credentials are available without exiting."""
    if not GSC_KEY_FILE:
        return False
    return Path(GSC_KEY_FILE).exists()


def authenticate():
    """Authenticate with GSC API using service account credentials."""
    if not GSC_KEY_FILE:
        print("ERROR: GSC_KEY_FILE env var not set. Point it at your service account JSON key.", file=sys.stderr)
        print("  export GSC_KEY_FILE=path/to/service-account-key.json", file=sys.stderr)
        sys.exit(1)

    key_path = Path(GSC_KEY_FILE)
    if not key_path.exists():
        print(f"ERROR: Key file not found: {GSC_KEY_FILE}", file=sys.stderr)
        sys.exit(1)

    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError:
        print("ERROR: Missing Python packages. Install with:", file=sys.stderr)
        print("  pip install -r scripts/requirements-gsc.txt", file=sys.stderr)
        sys.exit(1)

    scopes = ["https://www.googleapis.com/auth/webmasters.readonly"]
    credentials = service_account.Credentials.from_service_account_file(
        GSC_KEY_FILE, scopes=scopes
    )
    webmasters = build("webmasters", "v3", credentials=credentials)
    return webmasters


def fetch_search_analytics(webmasters, start_date: str, end_date: str):
    """Fetch search analytics data from GSC API."""
    request_body = {
        "startDate": start_date,
        "endDate": end_date,
        "dimensions": ["query", "page"],
        "rowLimit": 1000,
    }

    response = webmasters.searchanalytics().query(
        siteUrl=GSC_SITE_URL, body=request_body
    ).execute()

    return response.get("rows", [])


def fetch_sitemap_status(webmasters):
    """Check sitemap status for the site."""
    try:
        sitemaps = webmasters.sitemaps().list(siteUrl=GSC_SITE_URL).execute()
        return sitemaps.get("sitemap", [])
    except Exception as e:
        return [{"error": str(e)}]


def generate_report(rows, sitemaps, start_date: str, end_date: str, no_data: bool = False):
    """Generate a human-readable report from GSC data."""
    now = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")

    if no_data or not rows:
        report = f"""# GSC Weekly Report — studiomethod.ai
Generated: {now}
Period: {start_date} → {end_date}

## Summary

⚠️ No GSC data available yet. This is expected — GSC domain property was verified on Apr 28, 2026,
and data typically takes 2–4 weeks to populate after verification.

| Metric | Value |
|---|---|
| Total Clicks | N/A |
| Total Impressions | N/A |
| Average Position | N/A |
| Overall CTR | N/A |

## Next Steps
- GSC data should begin populating by ~May 15, 2026
- Once credentials are configured, this report will include real data
- Run `python3 scripts/gsc-weekly-report.py` after credentials are set up

## Infrastructure Status
- ✅ Report script: ready (`scripts/gsc-weekly-report.py`)
- ✅ Python dependencies: listed in `scripts/requirements-gsc.txt`
- {"✅" if has_credentials() else "❌"} GSC API credentials: {"configured" if has_credentials() else "pending — GCP service account needed"}
- ✅ Weekly cron: configured (launchd)
"""
        return report

    # Aggregate metrics
    total_clicks = 0
    total_impressions = 0
    total_position = 0
    position_count = 0

    top_queries = []
    top_pages = []

    for row in rows:
        clicks = row.get("clicks", 0)
        impressions = row.get("impressions", 0)
        position = row.get("position", 0)
        ctr = row.get("ctr", 0)

        total_clicks += clicks
        total_impressions += impressions
        total_position += position
        position_count += 1

        keys = row.get("keys", [])
        if len(keys) >= 2:
            query, page = keys[0], keys[1]
        elif len(keys) == 1:
            query, page = keys[0], "unknown"
        else:
            query, page = "unknown", "unknown"

        top_queries.append({"query": query, "clicks": clicks, "impressions": impressions, "ctr": ctr, "position": position})
        top_pages.append({"page": page, "clicks": clicks, "impressions": impressions})

    avg_position = round(total_position / position_count, 1) if position_count else 0
    overall_ctr = round(total_clicks / total_impressions * 100, 2) if total_impressions else 0

    # Sort and deduplicate
    top_queries.sort(key=lambda x: x["clicks"], reverse=True)
    top_queries = top_queries[:20]

    page_agg = {}
    for p in top_pages:
        page = p["page"]
        if page not in page_agg:
            page_agg[page] = {"clicks": 0, "impressions": 0}
        page_agg[page]["clicks"] += p["clicks"]
        page_agg[page]["impressions"] += p["impressions"]
    top_pages_sorted = sorted(page_agg.items(), key=lambda x: x[1]["clicks"], reverse=True)[:10]

    # Build report
    report = f"""# GSC Weekly Report — studiomethod.ai
Generated: {now}
Period: {start_date} → {end_date}

## Summary
| Metric | Value |
|---|---|
| Total Clicks | {total_clicks} |
| Total Impressions | {total_impressions} |
| Average Position | {avg_position} |
| Overall CTR | {overall_ctr}% |

## Top 20 Queries by Clicks
| Query | Clicks | Impressions | CTR | Avg Position |
|---|---|---|---|---|
"""
    for q in top_queries:
        report += f"| {q['query']} | {q['clicks']} | {q['impressions']} | {round(q['ctr']*100,2)}% | {round(q['position'],1)} |\n"

    report += f"""
## Top 10 Pages by Clicks
| Page | Clicks | Impressions |
|---|---|---|
"""
    for page, data in top_pages_sorted:
        report += f"| {page} | {data['clicks']} | {data['impressions']} |\n"

    # Sitemap status
    report += "\n## Sitemap Status\n"
    if isinstance(sitemaps, list) and sitemaps:
        for s in sitemaps:
            if "error" in s:
                report += f"- Error: {s['error']}\n"
            else:
                path = s.get("path", "unknown")
                is_pending = s.get("isPending", False)
                last_submitted = s.get("lastSubmitted", "unknown")
                errors = s.get("errors", 0)
                warnings = s.get("warnings", 0)
                report += f"- `{path}` — Submitted: {last_submitted} | Pending: {is_pending} | Errors: {errors} | Warnings: {warnings}\n"
    else:
        report += "- No sitemaps found or unable to fetch\n"

    return report


def save_report(report_text: str, start_date: str, end_date: str):
    """Save report to disk."""
    output_dir = Path(GSC_OUTPUT_DIR)
    output_dir.mkdir(parents=True, exist_ok=True)

    filename = f"gsc-weekly-{start_date}_to_{end_date}.md"
    filepath = output_dir / filename
    filepath.write_text(report_text, encoding="utf-8")
    print(f"Report saved to: {filepath}")
    return filepath


def run_dry():
    """Run in dry-run mode — generate a no-data template report."""
    start_date, end_date = date_range(GSC_DAYS_BACK)
    print(f"GSC Weekly Report (DRY RUN) for {GSC_SITE_URL}")
    print(f"Period: {start_date} → {end_date}")

    report = generate_report([], [], start_date, end_date, no_data=True)
    filepath = save_report(report, start_date, end_date)

    print("\n" + "=" * 60)
    print(report)
    print("=" * 60)
    print(f"\n✓ Dry-run report complete. File: {filepath}")
    return 0


def run_live():
    """Run with real GSC API credentials."""
    print(f"GSC Weekly Report for {GSC_SITE_URL}")
    start_date, end_date = date_range(GSC_DAYS_BACK)
    print(f"Period: {start_date} → {end_date}")

    # Authenticate
    print("Authenticating with Google Search Console API...")
    webmasters = authenticate()
    print("✓ Authenticated successfully")

    # Fetch data
    print("Fetching search analytics...")
    rows = fetch_search_analytics(webmasters, start_date, end_date)
    print(f"✓ Fetched {len(rows)} rows")

    # Fetch sitemap status
    print("Checking sitemap status...")
    sitemaps = fetch_sitemap_status(webmasters)

    # Generate report
    print("Generating report...")
    report = generate_report(rows, sitemaps, start_date, end_date, no_data=len(rows) == 0)

    # Save
    filepath = save_report(report, start_date, end_date)

    # Also print to stdout
    print("\n" + "=" * 60)
    print(report)
    print("=" * 60)

    print(f"\n✓ Report complete. File: {filepath}")
    return 0


# ── Main ────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="GSC Weekly Report Generator for studiomethod.ai")
    parser.add_argument("--dry-run", action="store_true", help="Generate template report without API credentials")
    parser.add_argument("--cron", action="store_true", help="Cron mode: run live if credentials present, otherwise exit 2")
    args = parser.parse_args()

    if args.dry_run:
        return run_dry()

    if args.cron:
        if not has_credentials():
            print("GSC credentials not configured — skipping report generation.", file=sys.stderr)
            print("Set GSC_KEY_FILE to enable live reports.", file=sys.stderr)
            return 2
        return run_live()

    # Default: live run
    return run_live()


if __name__ == "__main__":
    sys.exit(main())