# cyber-atlas

A dark, animated world map that replays real, community-reported attack-source
data — inspired by [NICTER Atlas](https://www.nicter.jp/atlas), NICT's
darknet-sensor cyberattack visualization.

## What it shows

Pulsing, color-coded markers sweep across a world map as attack events are
"replayed," alongside a live event ticker, a per-category stats panel, and
playback controls (pause / 1x / 2x / 4x).

A separate [**/trends**](/trends) view aggregates the same dataset by attack
category, reporting country, and hosting organization/ASN — a cross-sectional
analysis that (unlike the replay map) doesn't depend on the synthesized
timestamps described below.

## Data sources — and an important caveat

- **IP addresses and attack categories are real**, pulled from
  [blocklist.de](https://www.blocklist.de/en/export.html), a community
  project that aggregates fail2ban-style abuse reports (SSH, FTP, mail,
  Apache, IMAP, bot/malware scans, generic login brute force) from
  participating server operators worldwide.
- **Geolocation is real**, via [ip-api.com](https://ip-api.com/)'s free
  batch endpoint.
- **Timestamps are synthetic.** blocklist.de's lists are a rolling snapshot
  of IPs reported in roughly the last 48 hours, not a timestamped event
  stream. `scripts/build_dataset.py` assigns each event a randomized
  timestamp within a 24-hour replay window purely so the animation has
  something to sequence by. The *who* and *what category* are real; the
  *exact moment* shown during playback is not — this is a stylistic replay,
  not a live feed or an authoritative attack timeline.

This is a deliberate, documented tradeoff: real honeypot/darknet-sensor data
with genuine per-event timestamps (closer to what NICTER Atlas itself uses)
would need a running sensor and isn't something a static portfolio project
can responsibly claim to have without actually operating one.

## Tech stack

- [Next.js](https://nextjs.org/) 16 (App Router, Turbopack) / React 19 / TypeScript
- [MapLibre GL JS](https://maplibre.org/) + react-map-gl — map rendering
- Tailwind CSS
- Python (data pipeline, `scripts/build_dataset.py`, standard library only)

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Regenerating the dataset

```bash
python3 scripts/build_dataset.py
```

Fetches fresh IP lists from blocklist.de, geolocates a sample via ip-api.com,
and writes `data/events.json`. A [scheduled GitHub Action](.github/workflows/update-dataset.yml)
also runs this weekly and commits the result, so the dataset stays current
without a live backend — trigger it manually anytime via the Actions tab
("Update dataset" → "Run workflow").

## Possible next steps

- Deploy a real low-interaction honeypot and swap the synthetic-timestamp
  pipeline for a genuine, timestamped event log.
