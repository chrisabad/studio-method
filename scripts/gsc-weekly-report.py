#!/usr/bin/env python3
"""
GSC Weekly Organic Search Report for studiomethod.ai
Fetches data from Google Search Console API and formats a weekly report.

Usage:
  python3 gsc-weekly-report.py [--days 7] [--output json|markdown]

Requires:
  - Google credentials with https://www.googleapis.com/auth/webmasters.readonly scope
  - Site URL: https://studiomethod.ai (or sc-domain:studiomethod.ai)

Environment:
  - GOOGLE_APPLICATION_CREDENTIALS (service account JSON) OR
  - Uses gog CLI token refresh to get an access token
"""

import argparse
import json
import os
import sys
from datetime import datetime, timedelta

try:
    from google.oauth2 import service_account
    from googleapiclient.discovery import build
except ImportError:
    print("ERROR: Install google-api-python-client and google-auth")
    print("  pip3 install google-api-python-client google-auth")
    sys.exit(1)

SITE_URL = "sc-domain:studiomethod.ai"  # Domain property format
API_SERVICE_NAME = "searchconsole"
API_VERSION = "v1"

BLOG_PATH_PREFIX = "/blog/"

def get_service(credentials_path=None, access_token=None):
    """Build and return a Search Console service object."""
    if credentials_path:
        credentials = service_account.Credentials.from_service_account_file(
            credentials_path,
            scopes=["https://www.googleapis.com/auth/webmasters.readonly"]
        )
        return build(API_SERVICE_NAME, API_VERSION, credentials=credentials)
    elif access_token:
        # Use access token directly (e.g., from gog OAuth)
        import google.oauth2.credentials
        credentials = google.oauth2.credentials.Credentials(token=access_token)
        return build(API_SERVICE_NAME, API_VERSION, credentials=credentials)
    else:
        print("ERROR: Provide either GOOGLE_APPLICATION_CREDENTIALS or access token")
        sys.exit(1)


def query_gsc(service, site_url, start_date, end_date, dimensions=None, filter_path=None):
    """Execute a GSC query and return results."""
    if dimensions is None:
        dimensions = ["date"]

    row_filter = None
    if filter_path:
        row_filter = {
            "filters": [{
                "dimension": "page",
                "operator": "contains",
                "expression": filter_path
            }]
        }

    request = {
        "startDate": start_date,
        "endDate": end_date,
        "dimensions": dimensions,
        "rowLimit": 1000,
        "dataState": "all"  # Include fresh data
    }
    if row_filter:
        request.update(row_filter)

    return service.searchanalytics().query(
        siteUrl=site_url,
        body=request
    ).execute()


def format_report(site_data, blog_data, top_queries, top_pages, period_start, period_end):
    """Format the weekly report as markdown."""
    report = []
    report.append(f"# Studio Method — Weekly Organic Search Report")
    report.append(f"")
    report.append(f"**Period:** {period_start} to {period_end}")
    report.append(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    report.append(f"")

    # Overview
    report.append(f"## Overview")
    site_clicks = site_data.get("clicks", 0) if site_data else "N/A"
    site_impressions = site_data.get("impressions", 0) if site_data else "N/A"
    site_ctr = f"{site_data.get('ctr', 0)*100:.1f}%" if site_data and site_data.get('ctr') else "N/A"
    site_position = f"{site_data.get('position', 0):.1f}" if site_data and site_data.get('position') else "N/A"

    report.append(f"| Metric | Value |")
    report.append(f"|--------|-------|")
    report.append(f"| Total Clicks | {site_clicks} |")
    report.append(f"| Total Impressions | {site_impressions} |")
    report.append(f"| Avg CTR | {site_ctr} |")
    report.append(f"| Avg Position | {site_position} |")
    report.append(f"")

    # Blog-specific
    report.append(f"## Blog Traffic (/blog/*)")
    blog_clicks = blog_data.get("clicks", 0) if blog_data else "N/A"
    blog_impressions = blog_data.get("impressions", 0) if blog_data else "N/A"
    blog_ctr = f"{blog_data.get('ctr', 0)*100:.1f}%" if blog_data and blog_data.get('ctr') else "N/A"
    blog_position = f"{blog_data.get('position', 0):.1f}" if blog_data and blog_data.get('position') else "N/A"

    report.append(f"| Metric | Value |")
    report.append(f"|--------|-------|")
    report.append(f"| Blog Clicks | {blog_clicks} |")
    report.append(f"| Blog Impressions | {blog_impressions} |")
    report.append(f"| Blog CTR | {blog_ctr} |")
    report.append(f"| Blog Avg Position | {blog_position} |")
    report.append(f"")

    # Top Queries
    report.append(f"## Top Queries")
    if top_queries:
        report.append(f"| Query | Clicks | Impressions | CTR | Position |")
        report.append(f"|-------|--------|-------------|-----|----------|")
        for row in top_queries[:15]:
            keys = row.get("keys", ["unknown"])
            report.append(f"| {keys[0]} | {row.get('clicks', 0)} | {row.get('impressions', 0)} | {row.get('ctr',0)*100:.1f}% | {row.get('position',0):.1f} |")
    else:
        report.append(f"*No query data available yet*")
    report.append(f"")

    # Top Pages
    report.append(f"## Top Pages")
    if top_pages:
        report.append(f"| Page | Clicks | Impressions | CTR | Position |")
        report.append(f"|------|--------|-------------|-----|----------|")
        for row in top_pages[:15]:
            keys = row.get("keys", ["unknown"])
            report.append(f"| {keys[0]} | {row.get('clicks', 0)} | {row.get('impressions', 0)} | {row.get('ctr',0)*100:.1f}% | {row.get('position',0):.1f} |")
    else:
        report.append(f"*No page data available yet*")
    report.append(f"")

    # Index Coverage Note
    report.append(f"## Notes")
    report.append(f"- GSC domain property verified: Apr 28, 2026")
    report.append(f"- Data typically takes 2-4 weeks to fully populate after verification")
    report.append(f"- Blog content: 4 posts published (as of report date)")
    report.append(f"- Sitemap submitted via sitemap.xml (auto-generated by Next.js)")

    return "\n".join(report)


def compute_totals(rows):
    """Compute aggregate totals from GSC rows."""
    if not rows:
        return None
    total_clicks = sum(r.get("clicks", 0) for r in rows)
    total_impressions = sum(r.get("impressions", 0) for r in rows)
    avg_ctr = total_clicks / total_impressions if total_impressions > 0 else 0
    # Weighted average position
    total_pos = sum(r.get("position", 0) * r.get("impressions", 0) for r in rows)
    avg_position = total_pos / total_impressions if total_impressions > 0 else 0
    return {
        "clicks": total_clicks,
        "impressions": total_impressions,
        "ctr": avg_ctr,
        "position": avg_position
    }


def main():
    parser = argparse.ArgumentParser(description="GSC Weekly Report for studiomethod.ai")
    parser.add_argument("--days", type=int, default=7, help="Number of days to report on")
    parser.add_argument("--output", choices=["json", "markdown"], default="markdown")
    parser.add_argument("--credentials", help="Path to service account JSON")
    parser.add_argument("--access-token", help="OAuth access token")
    args = parser.parse_args()

    end_date = datetime.now() - timedelta(days=3)  # GSC data has ~3 day lag
    start_date = end_date - timedelta(days=args.days)
    
    period_start = start_date.strftime("%Y-%m-%d")
    period_end = end_date.strftime("%Y-%m-%d")

    print(f"Fetching GSC data for {SITE_URL}: {period_start} to {period_end}", file=sys.stderr)

    # Try to build service
    creds_path = args.credentials or os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    access_token = args.access_token or os.environ.get("GOG_ACCESS_TOKEN")

    if not creds_path and not access_token:
        print("WARNING: No credentials available. Generating template report with N/A values.", file=sys.stderr)
        # Generate a template report with no data
        report = format_report(None, None, [], [], period_start, period_end)
        if args.output == "json":
            print(json.dumps({"report": report, "has_data": False}, indent=2))
        else:
            print(report)
        return

    try:
        service = get_service(credentials_path=creds_path, access_token=access_token)
    except Exception as e:
        print(f"ERROR: Failed to authenticate: {e}", file=sys.stderr)
        sys.exit(1)

    # Fetch data
    try:
        # Site-wide totals (by date, then aggregate)
        site_rows = query_gsc(service, SITE_URL, period_start, period_end, dimensions=["query"])
        site_totals = compute_totals(site_rows.get("rows", []))

        # Blog-specific
        blog_rows = query_gsc(service, SITE_URL, period_start, period_end, dimensions=["query"], filter_path=BLOG_PATH_PREFIX)
        blog_totals = compute_totals(blog_rows.get("rows", []))

        # Top queries
        top_queries = query_gsc(service, SITE_URL, period_start, period_end, dimensions=["query"]).get("rows", [])
        top_queries.sort(key=lambda r: r.get("clicks", 0), reverse=True)

        # Top pages
        top_pages = query_gsc(service, SITE_URL, period_start, period_end, dimensions=["page"]).get("rows", [])
        top_pages.sort(key=lambda r: r.get("clicks", 0), reverse=True)

    except Exception as e:
        print(f"ERROR: GSC query failed: {e}", file=sys.stderr)
        sys.exit(1)

    report = format_report(site_totals, blog_totals, top_queries, top_pages, period_start, period_end)

    if args.output == "json":
        print(json.dumps({
            "report": report,
            "has_data": site_totals is not None and site_totals.get("clicks", 0) > 0,
            "period_start": period_start,
            "period_end": period_end,
            "site_totals": site_totals,
            "blog_totals": blog_totals
        }, indent=2, default=str))
    else:
        print(report)


if __name__ == "__main__":
    main()