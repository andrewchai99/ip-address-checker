# IP Pulse — Batch IP Geolocation & ISP Inspector

Single-file HTML tool for batch IP geolocation, ISP/ASN lookup, and IP-type classification (residential vs. mobile vs. data center/hosting vs. proxy/VPN).

## Usage

Open `IP address checker.html` directly in a browser, or visit the deployed Vercel URL.

- Paste a plain list of IP addresses, **or**
- Click **Upload Raw File** to load a raw journal/log export in `Time;IP;Message` format — the tool auto-detects the format, deduplicates by IP, and enriches each unique IP with country, city/region, ISP & ASN, and IP type (residential / mobile / data center / proxy).
- Export results as CSV or JSON.

## Data sources

- [ip-api.com](https://ip-api.com) (primary, batch HTTP) — also provides `mobile`/`proxy`/`hosting` flags used for IP-type classification.
- [ipwho.is](https://ipwho.is) (HTTPS fallback when ip-api.com's HTTP endpoint is blocked by mixed-content restrictions).

No backend, no build step — pure static HTML/CSS/JS.
