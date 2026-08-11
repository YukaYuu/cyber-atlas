"""
blocklist.de(コミュニティ運営のfail2ban系レポートに基づく、実際に攻撃元として
報告されたIPアドレス一覧)を取得し、ip-api.comで位置情報を付与した上で、
Next.jsアプリが直接読み込める静的JSON(public/data/events.json)を生成する。

blocklist.deの各カテゴリ一覧は「直近48時間程度で報告されたIP」のスナップショット
であり、個々のイベントのタイムスタンプは持たない。そのため、リプレイ再生用の
timestampはこのスクリプトが再生ウィンドウ内にランダムに割り当てた合成値であり、
実際にその時刻に攻撃が発生したことを意味しない(IPアドレスと攻撃カテゴリは実データ、
発生時刻はリプレイ演出のための合成、という前提をREADMEにも明記する)。
"""

import json
import random
import time
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

OUT_PATH = Path(__file__).resolve().parent.parent / "data" / "events.json"

# カテゴリ名: (blocklist.deのリストID, 表示ラベル, リプレイの色分けに使う概念上のポート)
CATEGORIES = [
    ("ssh", "SSH Brute Force", 22),
    ("ftp", "FTP Brute Force", 21),
    ("mail", "Mail/SMTP Abuse", 25),
    ("apache", "Web (Apache) Attack", 80),
    ("imap", "IMAP Brute Force", 143),
    ("bots", "Bot / Malware Scan", None),
    ("bruteforcelogin", "Generic Login Brute Force", None),
]

SAMPLE_PER_CATEGORY = 60
REPLAY_WINDOW_HOURS = 24
GEOLOCATE_BATCH_SIZE = 100
GEOLOCATE_RATE_LIMIT_SLEEP_SEC = 4.5


def fetch_category_ips(list_id, sample_size, rng):
    url = f"https://lists.blocklist.de/lists/{list_id}.txt"
    req = urllib.request.Request(url, headers={"User-Agent": "curl/8.0"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        raw = resp.read().decode("utf-8")
    all_ips = [line.strip() for line in raw.splitlines() if line.strip()]
    if len(all_ips) <= sample_size:
        return all_ips
    return rng.sample(all_ips, sample_size)


def geolocate_batch(ip_addresses):
    body = json.dumps([{"query": ip} for ip in ip_addresses]).encode("utf-8")
    req = urllib.request.Request(
        "http://ip-api.com/batch",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def chunk(items, size):
    if not items:
        return []
    return [items[:size]] + chunk(items[size:], size)


def build_events():
    rng = random.Random(0)
    candidates = []
    for list_id, label, port in CATEGORIES:
        print(f"blocklist.de/{list_id} を取得中...")
        ips = fetch_category_ips(list_id, SAMPLE_PER_CATEGORY, rng)
        print(f"  -> {len(ips)}件サンプリング")
        for ip in ips:
            candidates.append({"ip": ip, "category": list_id, "label": label, "port": port})

    geo_by_ip = {}
    for batch in chunk(candidates, GEOLOCATE_BATCH_SIZE):
        print(f"ip-api.comで{len(batch)}件を位置情報付与中...")
        results = geolocate_batch([c["ip"] for c in batch])
        for r in results:
            if r.get("status") == "success":
                geo_by_ip[r["query"]] = r
        time.sleep(GEOLOCATE_RATE_LIMIT_SLEEP_SEC)

    now = datetime.now(timezone.utc)
    window_start = now - timedelta(hours=REPLAY_WINDOW_HOURS)

    events = []
    for c in candidates:
        geo = geo_by_ip.get(c["ip"])
        if geo is None:
            continue
        offset_sec = rng.uniform(0, REPLAY_WINDOW_HOURS * 3600)
        ts = window_start + timedelta(seconds=offset_sec)
        events.append({
            "ip": c["ip"],
            "category": c["category"],
            "label": c["label"],
            "port": c["port"],
            "country": geo.get("country"),
            "countryCode": geo.get("countryCode"),
            "city": geo.get("city"),
            "lat": geo.get("lat"),
            "lon": geo.get("lon"),
            "isp": geo.get("isp"),
            "org": geo.get("org") or geo.get("isp"),
            "asn": (geo.get("as") or "").split(" ", 1)[0] or None,
            "timestamp": ts.isoformat().replace("+00:00", "Z"),
        })

    events.sort(key=lambda e: e["timestamp"])
    return events


def main():
    events = build_events()
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "replayWindowHours": REPLAY_WINDOW_HOURS,
        "sourceNote": (
            "IP addresses and attack categories are real, community-reported data "
            "from blocklist.de. Timestamps are synthesized within a replay window "
            "for animation purposes and do not represent actual attack times. "
            "Geolocation via ip-api.com."
        ),
        "categories": [
            {"id": cid, "label": label} for cid, label, _ in CATEGORIES
        ],
        "events": events,
    }
    OUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n{len(events)}件のイベントを {OUT_PATH} に書き出しました。")


if __name__ == "__main__":
    main()
