from __future__ import annotations

from datetime import datetime
from html import escape
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import subprocess


ROOT = Path(__file__).resolve().parents[2]
API_PATH = ROOT / "public" / "data" / "signal-desk" / "api.json"
LEAFLET_DIR = ROOT / "node_modules" / "leaflet" / "dist"


def format_date(value: str) -> str:
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).strftime("%b %d %H:%M")
    except ValueError:
        return value[:16]


def render_items(items: list[dict]) -> str:
    if not items:
        return "<em>No current items.</em>"
    return "".join(
        f"""
        <a href="{escape(item.get("url", ""))}" target="_blank" rel="noreferrer">
          <small>{escape(item.get("source", ""))}</small>
          <strong>{escape(item.get("title", ""))}</strong>
        </a>
        """
        for item in items[:3]
    )


def render_lanes(api: dict) -> str:
    return "".join(
        f"""
        <article class="lane">
          <div><span>{escape(lane["label"])}</span><b>{lane["item_count"]}</b></div>
          <h3>{escape(lane["role"])}</h3>
          <p>{escape(lane["question"])}</p>
          <section>{render_items(lane.get("items", []))}</section>
        </article>
        """
        for lane in api.get("source_lanes", [])
    )


def render_ground_needs(api: dict) -> str:
    return "".join(
        f"""
        <button class="ground" data-related="{escape(",".join(need.get("related_clusters", [])))}">
          <span>{escape(need["label"].replace("Before ", "Check before "))}</span>
          <strong>{escape(need["answer"])}</strong>
          <p>{escape(need["check"])}</p>
        </button>
        """
        for need in api.get("ground_needs", [])
    )


def render_health(api: dict) -> str:
    return "".join(
        f"""
        <div>
          <span>{"OK" if source["ok"] else "CHECK"}</span>
          <b>{escape(source["source"])}</b>
          <strong>{source["item_count"]}</strong>
        </div>
        """
        for source in api.get("source_health", [])
    )


def render_source_key() -> str:
    items = [
        ("Claims", "Hezbollah, IDF, and Telegram items tell you what a side wants recorded. They do not settle what happened."),
        ("Ground record", "Lebanese local outlets are where towns, ministries, hospitals, roads, and civilian effects usually become legible."),
        ("Corroboration", "Reuters, L'Orient, Haaretz, and regional wires help test whether a claim has crossed into a wider record."),
        ("Dissent", "Israeli dissent and long video analysis are useful when they complicate the official line or explain a battlefield pattern."),
    ]
    return "".join(
        f"""
        <article>
          <span>{escape(label)}</span>
          <p>{escape(copy)}</p>
        </article>
        """
        for label, copy in items
    )


def render_page() -> bytes:
    api = json.loads(API_PATH.read_text(encoding="utf-8"))
    data = {
        "clusters": api.get("clusters", []),
        "sourceLanes": api.get("source_lanes", []),
        "meta": api.get("meta", {}),
        "generatedAt": api.get("meta", {}).get("generated_at", ""),
    }
    mapped_count = len([cluster for cluster in api.get("clusters", []) if cluster.get("location_precision") != "unknown"])
    data_json = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    lanes = render_lanes(api)
    ground = render_ground_needs(api)
    health = render_health(api)
    source_key = render_source_key()
    body = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Signal Desk Preview</title>
<link rel="stylesheet" href="/vendor/leaflet.css">
<style>
:root{{color-scheme:dark;--bg:#100f0c;--panel:#191510;--panel2:#221b14;--ink:#f7ead5;--muted:#bea98c;--faint:rgba(247,234,213,.68);--line:rgba(247,234,213,.16);--strong:rgba(247,234,213,.32);--orange:#e2571f;--amber:#e9b86e;--red:#ff4d36;--teal:#7fa7a0;--blue:#87a7d9}}
*{{box-sizing:border-box}} body{{margin:0;background:linear-gradient(180deg,rgba(226,87,31,.08),transparent 18rem),linear-gradient(120deg,rgba(127,167,160,.08),transparent 30rem),var(--bg);color:var(--ink);font-family:Georgia,serif}} button{{font:inherit}}
main{{width:min(1540px,calc(100vw - 48px));margin:auto;padding:18px 0 34px}} header{{display:grid;grid-template-columns:minmax(220px,.42fr) minmax(360px,1fr) minmax(260px,.42fr);gap:18px;align-items:end;margin-bottom:14px}}
.mono,.over,.stats span,.tabs,.feed-top,.badges,.dossier dt,.ground span,.lane div span,.lane a small,.legend,.health span{{font:700 11px/1.1 ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase}}
.over,.stats span,.ground span,.lane div span{{color:var(--orange)}} h1{{margin:6px 0 0;font-size:clamp(46px,5.4vw,84px);line-height:.86;font-weight:620}} header p{{margin:0;color:var(--faint);font-size:clamp(17px,1.25vw,21px);line-height:1.16}}
.stats{{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0}} .stats div,.panel,.decision,.dossier,.ground,.lane,.card,.confirm{{background:linear-gradient(180deg,rgba(255,255,255,.035),transparent),var(--panel);border:1px solid var(--line);border-radius:8px}}
.stats div{{padding:11px}} .stats b{{display:block;margin-top:5px;font-size:32px;font-weight:520;line-height:.95}}
.freshness{{display:grid;grid-template-columns:auto 1fr auto auto;gap:12px;align-items:center;margin:0 0 14px;padding:11px 13px;background:rgba(247,234,213,.035);border:1px solid var(--line);border-radius:8px}} .freshness span,.freshness b{{font:700 11px ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase}} .freshness span{{color:var(--orange)}} .freshness p{{margin:0;color:var(--faint);line-height:1.16}} .freshness b{{color:var(--teal)}} .freshness button{{min-height:32px;padding:0 10px;color:var(--ink);background:rgba(127,167,160,.12);border:1px solid rgba(127,167,160,.42);border-radius:7px;cursor:pointer;font:700 10px ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase}} .freshness button[disabled]{{opacity:.62;cursor:wait}} .freshness[data-state="stale"]{{background:rgba(233,184,110,.08);border-color:rgba(233,184,110,.34)}} .freshness[data-state="stale"] b{{color:var(--amber)}}
.focus-note{{display:none;grid-template-columns:auto minmax(0,1fr);gap:10px;align-items:center;margin:-2px 0 14px;padding:10px 12px;background:rgba(127,167,160,.08);border:1px solid rgba(127,167,160,.26);border-radius:8px}} .focus-note.visible{{display:grid}} .focus-note span{{color:var(--teal);font:700 10px ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase}} .focus-note p{{margin:0;color:var(--faint);line-height:1.16}}
.priority{{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:0 0 14px}} .priority article{{min-width:0;padding:13px;background:linear-gradient(180deg,rgba(247,234,213,.052),rgba(247,234,213,.018)),#17130f;border:1px solid var(--line);border-radius:8px}} .priority span{{display:block;color:var(--orange);font:700 10px ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase}} .priority strong{{display:block;margin-top:7px;font-size:22px;line-height:1;font-weight:560}} .priority p{{margin:7px 0 0;color:var(--faint);line-height:1.16}} .priority button{{margin-top:10px;min-height:32px;padding:0 10px;color:var(--ink);background:rgba(127,167,160,.12);border:1px solid rgba(127,167,160,.42);border-radius:7px;cursor:pointer;font:700 10px ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase}}
.timeline{{display:grid;grid-template-columns:minmax(180px,.34fr) 1fr;gap:12px;align-items:end;margin:0 0 14px;padding:13px;background:rgba(247,234,213,.035);border:1px solid var(--line);border-radius:8px}} .timeline h2{{font-size:24px}} .timeline p{{margin:5px 0 0;color:var(--faint);line-height:1.16}} .timeline-bars{{display:grid;grid-template-columns:repeat(7,1fr);gap:7px;align-items:end;min-height:92px}} .timeline-day{{display:grid;grid-template-rows:1fr auto auto;gap:5px;min-width:0;color:var(--muted);font:700 10px ui-monospace,monospace;text-align:center;text-transform:uppercase}} .timeline-day i{{align-self:end;display:block;min-height:5px;border-radius:999px 999px 2px 2px;background:linear-gradient(180deg,var(--orange),rgba(226,87,31,.35))}} .timeline-day[data-hot=true] i{{background:linear-gradient(180deg,var(--red),var(--orange))}} .timeline-day b{{color:var(--ink);font-size:13px}}
.cockpit{{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(390px,.72fr);gap:14px}} .panel,.decision,.dossier{{padding:14px;min-width:0}} .top{{display:flex;justify-content:space-between;gap:16px;align-items:end;margin-bottom:10px}} h2{{margin:4px 0 0;font-size:clamp(24px,1.8vw,33px);line-height:1;font-weight:560}}
.map{{position:relative;height:clamp(430px,52vh,620px);overflow:hidden;border:1px solid var(--line);border-radius:8px;background:#0e1412}}
.map .leaflet-container,.map .leaflet-control-container{{font-family:Georgia,serif}} .map .leaflet-control-attribution{{background:rgba(16,15,12,.72);color:var(--muted);font:10px ui-monospace,monospace}} .map .leaflet-control-attribution a{{color:var(--amber)}} .map .leaflet-popup-content-wrapper,.map .leaflet-popup-tip{{background:#191510;color:var(--ink);border:1px solid var(--strong)}} .map .leaflet-popup-content{{font-size:15px;line-height:1.16}}
.pin{{position:absolute;z-index:3;display:grid;place-items:center;width:18px;height:18px;margin:-9px 0 0 -9px;border:1px solid var(--orange);border-radius:50%;background:var(--orange);box-shadow:0 0 0 8px rgba(226,87,31,.15);cursor:pointer}} .pin[data-low=true]{{z-index:1;width:52px;height:52px;margin:-26px 0 0 -26px;background:rgba(226,87,31,.08);border-style:dashed;box-shadow:none}} .pin[data-selected=true]{{z-index:5;outline:2px solid var(--ink);outline-offset:3px}} .pin[data-severity=critical]{{border-color:var(--red);background:var(--red)}} .pin[data-low=true][data-severity=critical]{{background:rgba(255,77,54,.1)}}
.legend{{position:absolute;left:14px;bottom:14px;z-index:3;display:flex;gap:10px;flex-wrap:wrap;background:rgba(16,15,12,.84);border:1px solid var(--line);border-radius:6px;padding:8px;color:var(--muted)}} .legend i{{display:inline-block;width:10px;height:10px;margin-right:5px;border:1px solid var(--orange);border-radius:50%;background:var(--orange)}} .legend i:last-child{{background:transparent;border-style:dashed}}
.holding{{display:grid;grid-template-columns:auto minmax(0,1fr);gap:10px;align-items:start;margin-top:12px;padding:11px;background:rgba(233,184,110,.08);border:1px dashed rgba(233,184,110,.34);border-radius:7px}} .holding>span,.holding button{{font:700 10px ui-monospace,monospace;letter-spacing:.05em;text-transform:uppercase}} .holding>span{{color:var(--amber)}} .holding div{{display:flex;gap:7px;flex-wrap:wrap;min-width:0}} .holding button{{max-width:min(100%,360px);overflow:hidden;padding:6px 8px;color:var(--faint);text-overflow:ellipsis;white-space:nowrap;background:rgba(16,15,12,.42);border:1px solid var(--line);border-radius:999px;cursor:pointer}} .holding button:hover{{color:var(--ink);border-color:rgba(233,184,110,.5)}}
.filters{{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:12px}} .chips{{display:flex;gap:7px;flex-wrap:wrap}} .chips button,.tabs button{{min-height:34px;padding:0 11px;color:var(--muted);background:rgba(247,234,213,.04);border:1px solid var(--line);border-radius:999px;cursor:pointer}} .chips button.active,.tabs button.active{{color:var(--ink);background:rgba(226,87,31,.18);border-color:rgba(226,87,31,.68)}}
.decision{{display:grid;grid-template-rows:auto auto auto 1fr auto;max-height:calc(60vh + 78px)}} .trust{{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px}} .trust div{{min-width:0;padding:9px;background:rgba(247,234,213,.04);border:1px solid var(--line);border-radius:7px}} .trust span{{display:block;color:var(--muted);font:700 10px ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase}} .trust b{{display:block;margin-top:4px;font-size:28px;line-height:.95;font-weight:560}} .tabs{{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px}} .tabs button{{display:flex;justify-content:space-between;align-items:center;border-radius:7px}} .feed{{display:grid;gap:8px;overflow:auto;padding-right:3px}} .feed button{{display:grid;gap:6px;padding:11px;text-align:left;color:inherit;background:rgba(247,234,213,.035);border:1px solid var(--line);border-radius:8px;cursor:pointer}} .feed button.active,.feed button:hover{{background:rgba(226,87,31,.1);border-color:rgba(226,87,31,.5)}} .feed-top{{display:flex;justify-content:space-between;color:var(--muted);font-size:10px}} .feed-top i,.badges span{{font-style:normal;border:1px solid var(--line);border-radius:999px;padding:3px 6px;color:var(--amber)}} .feed strong{{font-size:20px;line-height:1.02;font-weight:560}} .feed small,.truth{{color:var(--faint);line-height:1.2}}
.truth{{display:flex;gap:9px;margin-top:12px;padding:12px;background:rgba(226,87,31,.1);border:1px solid rgba(226,87,31,.32);border-radius:7px}}
.brief-cta{{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;margin-top:14px;padding:14px;background:linear-gradient(180deg,rgba(247,234,213,.06),rgba(247,234,213,.02)),#17130f;border:1px solid var(--strong);border-radius:8px}} .brief-cta h2{{font-size:26px}} .brief-cta p{{margin:4px 0 0;color:var(--faint);line-height:1.18}} .brief-cta button,.modal-close,.modal-print{{min-height:38px;padding:0 13px;color:var(--ink);background:rgba(226,87,31,.18);border:1px solid rgba(226,87,31,.58);border-radius:7px;cursor:pointer;font:700 11px ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase}}
.ground-row{{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:14px}} .ground{{display:grid;gap:8px;min-height:124px;padding:14px;text-align:left;color:inherit;cursor:pointer}} .ground strong{{font-size:22px;line-height:1;font-weight:560}} .ground p,.lane p,.card p{{margin:0;color:var(--faint);line-height:1.18}}
.dossier{{margin-top:18px}} .dossier-head{{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;margin-bottom:12px}} .badges{{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}} .dossier-grid{{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;margin:0;background:var(--line);border:1px solid var(--line);border-radius:8px;overflow:hidden}} .dossier div{{min-height:150px;padding:13px;background:#15110e}} .dossier dt{{margin-bottom:8px;color:var(--orange);font-size:10px}} .dossier dd{{margin:0;color:var(--faint);font-size:17px;line-height:1.22}} .dossier ul{{margin:0;padding-left:17px;display:grid;gap:6px}} .dossier a{{color:var(--amber);text-decoration:none;border-bottom:1px solid rgba(233,184,110,.42)}}
.section{{margin-top:20px}} .section-head{{display:flex;justify-content:space-between;align-items:end;margin-bottom:10px}} .source-key{{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:10px}} .source-key article{{padding:12px;background:rgba(127,167,160,.08);border:1px solid rgba(127,167,160,.24);border-radius:8px}} .source-key span{{display:block;color:var(--teal);font:700 10px ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase}} .source-key p{{margin:7px 0 0;color:var(--faint);line-height:1.16}} .lane-grid{{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}} .lane{{min-height:280px;padding:13px;display:grid;grid-template-rows:auto auto auto 1fr;gap:9px}} .lane div{{display:flex;justify-content:space-between;gap:8px}} .lane div b{{font-size:25px;font-weight:500}} .lane h3{{margin:0;font-size:18px;line-height:1;font-weight:560}} .lane a{{display:block;color:var(--ink);text-decoration:none;border-top:1px solid var(--line);padding-top:8px;margin-top:8px}} .lane a small{{display:block;color:var(--muted);font-size:10px}} .lane a strong{{display:block;margin-top:4px;font-size:16px;line-height:1.05}}
.card-grid{{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}} .card{{display:grid;gap:10px;min-height:250px;padding:14px;text-align:left;color:var(--ink);cursor:pointer}} .card.active,.card:hover{{border-color:rgba(226,87,31,.52);background:linear-gradient(180deg,rgba(226,87,31,.08),rgba(255,255,255,.03)),var(--panel2)}} .card strong{{font-size:22px;line-height:1;font-weight:560}} .card small{{color:var(--muted);font:700 10px ui-monospace,monospace;text-transform:uppercase;line-height:1.3}}
.confirm{{display:grid;grid-template-columns:auto 1fr;gap:10px;margin-top:18px;padding:15px;color:var(--amber)}} .confirm h2{{font-size:26px}} .confirm p{{margin:4px 0 0;color:var(--faint)}}
.brief-modal{{position:fixed;inset:0;z-index:1000;display:none;background:rgba(6,5,4,.82);padding:24px;overflow:auto}} .brief-modal.open{{display:block}} .brief-paper{{width:min(980px,100%);margin:auto;padding:34px;background:#f4eadb;color:#17110c;border-radius:6px;box-shadow:0 28px 90px rgba(0,0,0,.55)}} .brief-paper header{{display:grid;grid-template-columns:1fr auto;gap:18px;align-items:start;margin:0 0 22px;min-height:0}} .brief-actions{{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}} .modal-print{{background:rgba(27,104,114,.16);border-color:rgba(27,104,114,.44);color:#17110c}} .brief-paper .over{{color:#b6421d}} .brief-paper h1{{font-size:52px;color:#17110c}} .brief-paper h2{{color:#17110c}} .brief-paper p{{color:#46392c}} .brief-grid{{display:grid;grid-template-columns:1.1fr .9fr;gap:16px;margin-top:16px}} .brief-box{{padding:14px;border:1px solid rgba(40,30,20,.2);border-radius:6px;background:rgba(255,255,255,.32)}} .brief-box h3{{margin:0 0 8px;font-size:21px;line-height:1}} .brief-table{{width:100%;border-collapse:collapse;font-size:15px}} .brief-table td,.brief-table th{{padding:8px 0;border-top:1px solid rgba(40,30,20,.18);text-align:left;vertical-align:top}} .brief-bars{{display:grid;gap:8px}} .brief-bar{{display:grid;grid-template-columns:110px 1fr auto;gap:8px;align-items:center;font:700 11px ui-monospace,monospace;text-transform:uppercase}} .brief-bar i{{display:block;height:9px;background:#d9c6ad;border-radius:999px;overflow:hidden}} .brief-bar i span{{display:block;height:100%;background:#c14a2e}} .brief-signal{{display:grid;grid-template-columns:repeat(7,1fr);gap:5px;align-items:end;height:104px;margin-top:8px}} .brief-signal div{{display:grid;grid-template-rows:1fr auto;gap:4px;text-align:center;font:700 9px ui-monospace,monospace;text-transform:uppercase;color:#6d5b47}} .brief-signal i{{display:block;align-self:end;min-height:4px;background:#c14a2e;border-radius:999px 999px 2px 2px}} .mini-map{{height:190px;border-radius:6px;background:linear-gradient(90deg,rgba(20,15,10,.07) 1px,transparent 1px),linear-gradient(rgba(20,15,10,.07) 1px,transparent 1px),#e7dccb;background-size:24px 24px;position:relative;overflow:hidden}} .mini-map:after{{content:"";position:absolute;inset:18% 36% 10% 32%;background:rgba(27,104,114,.22);clip-path:polygon(44% 0,62% 10%,54% 30%,68% 44%,57% 62%,52% 88%,35% 100%,23% 78%,33% 54%,20% 32%,32% 16%)}} .brief-foot{{display:flex;justify-content:space-between;gap:12px;margin-top:18px;color:#6d5b47;font:700 11px ui-monospace,monospace;text-transform:uppercase}}
.print-only{{display:none}}
@media print{{body{{background:#fff;color:#111}} body>*:not(.brief-modal){{display:none!important}} .brief-modal{{display:block!important;position:static;inset:auto;padding:0;background:#fff;overflow:visible}} .brief-paper{{width:100%;box-shadow:none;border-radius:0;padding:0;background:#fff;color:#111}} .brief-paper header{{grid-template-columns:1fr;margin-bottom:14px}} .brief-actions,.modal-close,.modal-print{{display:none!important}} .print-only{{display:block}} .brief-box{{break-inside:avoid;background:#fff;border-color:#cfc4b5}} .brief-grid{{grid-template-columns:1fr 1fr}} @page{{size:letter;margin:.55in}}}}
.health{{display:grid;gap:6px;margin-top:12px}} .health div{{display:grid;grid-template-columns:auto 1fr auto;gap:8px;border-top:1px solid var(--line);padding-top:8px;color:var(--muted);font:12px ui-monospace,monospace}}
@media(max-width:1180px){{header,.cockpit,.dossier-grid,.ground-row,.lane-grid,.card-grid,.priority,.source-key{{grid-template-columns:repeat(2,1fr)}}.timeline{{grid-template-columns:1fr}}.decision{{max-height:none}}}}
@media(max-width:760px){{main{{width:calc(100vw - 24px);padding-top:14px}}header,.cockpit,.stats,.freshness,.focus-note,.dossier-grid,.ground-row,.lane-grid,.card-grid,.holding,.trust,.brief-cta,.brief-grid,.brief-paper header,.priority,.source-key{{grid-template-columns:1fr}}h1{{font-size:52px}}.map{{height:380px}}.timeline-bars{{min-height:78px}}.dossier-head,.top,.section-head{{align-items:flex-start;flex-direction:column}}.brief-modal{{padding:10px}}.brief-paper{{padding:18px}}.brief-paper h1{{font-size:38px}}}}
</style>
</head>
<body><main>
<header>
  <div><div class="over">Lebanon field brief</div><h1>Signal Desk</h1></div>
  <p>Start here: where the risk is, what is only claimed, what changed since the last scan, and what deserves a full read before anyone repeats it.</p>
  <div class="stats"><div><span>Dossiers</span><b>{api["meta"]["cluster_count"]}</b></div><div><span>Sources</span><b>{api["meta"]["source_count"]}</b></div><div><span>Mapped</span><b>{mapped_count}</b></div></div>
</header>
<section id="freshness" class="freshness" aria-label="Data freshness"></section>
<section id="focusNote" class="focus-note" aria-live="polite"></section>
<section id="priority" class="priority" aria-label="Read first"></section>
<section id="timeline" class="timeline" aria-label="Seven day signal timeline"></section>
<div class="cockpit">
  <section class="panel">
    <div class="top"><div><span class="over">Live map</span><h2>Mapped risk, with caveats</h2></div><span class="mono">{format_date(api["meta"]["generated_at"])}</span></div>
    <div id="map" class="map"><div class="legend"><span><i></i> exact place</span><span><i></i> district or halo</span></div></div>
    <div id="holding" class="holding" hidden></div>
    <div class="filters"><div><span class="over">Layers</span><div id="layers" class="chips"></div></div><div><span class="over">Window</span><div class="chips"><button class="active">7d</button></div></div></div>
  </section>
  <aside class="decision">
    <div class="top"><span class="over">What to check first</span><span class="mono">{escape(api["meta"]["mode"])}</span></div>
    <div class="brief-cta">
      <div><span class="over">Morning brief</span><h2>Open the printable packet</h2><p>One page with the lead event, outlet-by-outlet watch list, confidence bars, map notes, and gaps.</p></div>
      <button id="openBrief" type="button">Open brief</button>
    </div>
    <div id="trust" class="trust"></div>
    <div id="tabs" class="tabs"></div>
    <div id="feed" class="feed"></div>
    <div class="truth">Hezbollah, IDF, and Telegram items are claims until another lane confirms place, time, and effect.</div>
  </aside>
</div>
<section class="section"><div class="section-head"><div><span class="over">Three checks</span><h2>Before you act on this</h2></div><span class="mono">not emergency instructions</span></div><div class="ground-row">{ground}</div></section>
<section class="dossier"><div id="dossier"></div></section>
<section class="section"><div class="section-head"><div><span class="over">Source readout</span><h2>How to read the claims</h2></div><span class="mono">{len(api.get("source_lanes", []))} lanes</span></div><div id="source-key" class="source-key">{source_key}</div><div class="lane-grid">{lanes}</div></section>
<section class="section"><div class="section-head"><div><span class="over">Event files</span><h2>What changed</h2></div><span id="shown" class="mono"></span></div><div id="cards" class="card-grid"></div></section>
<section class="confirm"><span>?</span><div><h2>What I could not confirm</h2><p id="unconfirmed"></p></div></section>
<section class="health">{health}</section>
<div id="briefModal" class="brief-modal" aria-hidden="true">
  <article class="brief-paper">
    <header><div><span class="over">Signal Desk packet</span><h1>Morning Brief</h1><p id="briefDate"></p><p class="print-only">Printed from Lebanese Academic Signal Desk.</p></div><div class="brief-actions"><button id="printBrief" class="modal-print" type="button">Print / PDF</button><button id="closeBrief" class="modal-close" type="button">Close</button></div></header>
    <div id="briefBody"></div>
    <div class="brief-foot"><span>Public review copy</span><span>Claims are not facts until corroborated</span></div>
  </article>
</div>
<script id="signal-data" type="application/json">{data_json}</script>
<script src="/vendor/leaflet.js"></script>
<script>
const data = JSON.parse(document.getElementById('signal-data').textContent);
const clusters = data.clusters || [];
const sourceLanes = data.sourceLanes || [];
let selected = clusters[0]?.id || null;
let activeLayers = new Set(['danger','claims','displacement']);
let feedMode = 'now';
let mapObj = null;
let markerLayer = null;
const labels = {{danger:'Danger', displacement:'Displacement', claims:'Claims', services:'Civilian services', narrative:'Narrative'}};
const laneLabels = {{"israeli-establishment":"Israeli establishment","israeli-dissent":"Israeli dissent","lebanese-local":"Lebanese local","resistance-apparatus":"Resistance apparatus","wires-regional":"Wires and regionals","video-analysis":"Video analysis","framework-desk":"Framework desk"}};
const lebanonTerms = ['lebanon','lebanese','hezbollah','beirut','dahieh','nabatieh','tyre','sidon','saida','bekaa','baalbek','hermel','south lebanon','bint jbeil','marjayoun','khiam','aadaysit','ayshiyeh','naameh','unifil','blue line'];
function isLebanonSignal(c){{if(c.location_precision && c.location_precision!=='unknown') return true; const text=[c.headline,c.what_happened,c.where,c.primary_location?.name,(c.sources||[]).join(' '),(c.urls||[]).join(' ')].join(' ').toLowerCase(); return lebanonTerms.some(term=>text.includes(term))}}
function statusLabel(status){{return status === 'corroborated' ? 'Corroborated' : status === 'partly-corroborated' ? 'Partly corroborated' : status === 'single-source' ? 'Single source' : 'Unconfirmed'}}
function layersFor(c){{const ids=new Set(); const tags=c.signal_tags||[]; const flags=c.civilian_impact_flags||[]; if(['critical','high'].includes(c.severity)||tags.includes('strike-claim')||tags.includes('casualty')) ids.add('danger'); if(tags.includes('displacement')||flags.some(f=>['evacuation','displacement'].includes(f))) ids.add('displacement'); if(['single-source','unconfirmed'].includes(c.confirmation_status)||(c.source_lanes||[]).includes('resistance-apparatus')) ids.add('claims'); if(flags.some(f=>['roads','hospitals','schools','water','electricity','telecoms'].includes(f))) ids.add('services'); if(tags.includes('rhetoric-shift')||tags.includes('political-maneuver')||(c.source_lanes||[]).includes('israeli-dissent')||(c.source_lanes||[]).includes('framework-desk')) ids.add('narrative'); if(!ids.size) ids.add('narrative'); return ids}}
function bucket(c){{if(['single-source','unconfirmed'].includes(c.confirmation_status)||c.location_precision!=='exact') return 'unconfirmed'; if(['critical','high'].includes(c.severity)) return 'now'; return 'watch'}}
function filtered(){{return clusters.filter(c=>{{const ids=layersFor(c); return !activeLayers.size || [...activeLayers].some(layer=>ids.has(layer))}})}}
function esc(s){{return String(s||'').replace(/[&<>"']/g,m=>({{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}}[m]))}}
function pos(c,index=0,total=1){{const loc=c.primary_location||{{lat:33.86,lng:35.72}}; let left=Math.max(5,Math.min(95,((loc.lng-34.65)/(36.85-34.65))*100)); let top=Math.max(5,Math.min(95,(1-((loc.lat-32.8)/(34.85-32.8)))*100)); if(total>1){{const angle=(Math.PI*2*index)/total; const spread=Math.min(4.2,1.8+total*.32); left+=Math.cos(angle)*spread; top+=Math.sin(angle)*spread}} return [left,top]}}
function markerColor(c){{if(c.severity==='critical') return '#ff4d36'; if(c.severity==='high') return '#e2571f'; if(c.severity==='moderate') return '#e9b86e'; return '#7fa7a0'}}
function initMap(){{if(mapObj || !window.L) return; mapObj=L.map('map',{{scrollWheelZoom:false,attributionControl:true,zoomControl:true,maxBounds:[[32.8,34.65],[34.85,36.85]],maxBoundsViscosity:.86}}).setView([33.86,35.72],8); L.tileLayer('https://{{s}}.tile.opentopomap.org/{{z}}/{{x}}/{{y}}.png',{{maxZoom:13,opacity:.74,attribution:'Map data © OpenStreetMap contributors, SRTM | Style © OpenTopoMap'}}).addTo(mapObj); L.polygon([[34.65,36.2],[34.05,35.82],[33.88,35.68],[33.55,35.52],[33.1,35.18],[33.33,35.65],[33.92,35.88]],{{color:'rgba(247,234,213,.35)',weight:1,fillColor:'rgba(127,167,160,.12)',fillOpacity:.4,interactive:false}}).addTo(mapObj); markerLayer=L.layerGroup().addTo(mapObj); setTimeout(()=>mapObj.invalidateSize(),120)}}
function renderLayers(){{document.getElementById('layers').innerHTML=Object.entries(labels).map(([id,label])=>`<button class="${{activeLayers.has(id)?'active':''}}" data-layer="${{id}}">${{label}}</button>`).join(''); document.querySelectorAll('[data-layer]').forEach(btn=>btn.onclick=()=>{{activeLayers.has(btn.dataset.layer)?activeLayers.delete(btn.dataset.layer):activeLayers.add(btn.dataset.layer); render()}})}}
function renderMap(items){{initMap(); document.querySelectorAll('.pin').forEach(pin=>pin.remove()); const mapped=items.filter(c=>c.location_precision!=='unknown'); const groups=new Map(); mapped.forEach(c=>{{const loc=c.primary_location||{{}}; const key=[loc.lat,loc.lng].join(','); if(!groups.has(key)) groups.set(key,[]); groups.get(key).push(c)}}); if(markerLayer){{markerLayer.clearLayers(); for(const group of groups.values()){{group.forEach((c,index)=>{{const loc=c.primary_location; const angle=(Math.PI*2*index)/group.length; const offset=group.length>1?.018:0; const lat=loc.lat+Math.sin(angle)*offset; const lng=loc.lng+Math.cos(angle)*offset; const low=['single-source','unconfirmed'].includes(c.confirmation_status)||c.location_precision!=='exact'; const color=markerColor(c); const marker=low?L.circle([lat,lng],{{radius:c.location_precision==='district'?14500:9000,color,fillColor:color,fillOpacity:(selected===c.id ? .18 : .08),weight:selected===c.id?3:2,dashArray:'5 6'}}):L.circleMarker([lat,lng],{{radius:selected===c.id?9:7,color,fillColor:color,fillOpacity:.86,weight:selected===c.id?3:1.5}}); marker.bindPopup(`<strong>${{esc(c.headline)}}</strong><br><span>${{esc(c.where||c.primary_location?.name)}} / ${{statusLabel(c.confirmation_status)}}</span><p>${{esc(c.what_happened||c.what_is_missing)}}</p>`); marker.on('click',()=>{{selected=c.id; render()}}); marker.addTo(markerLayer)}})}} return}} const map=document.getElementById('map'); for(const group of groups.values()){{group.forEach((c,index)=>{{const [left,top]=pos(c,index,group.length); const pin=document.createElement('button'); pin.className='pin'; pin.style.left=left+'%'; pin.style.top=top+'%'; pin.dataset.low=String(['single-source','unconfirmed'].includes(c.confirmation_status)||c.location_precision!=='exact'); pin.dataset.selected=String(selected===c.id); pin.dataset.severity=c.severity; pin.title=c.headline; pin.onclick=()=>{{selected=c.id; render()}}; map.appendChild(pin)}})}}}}
function renderHolding(items){{const unclear=items.filter(c=>c.location_precision==='unknown'); const node=document.getElementById('holding'); if(!unclear.length){{node.hidden=true; node.innerHTML=''; return}} node.hidden=false; node.innerHTML=`<span>Location unclear</span><div>${{unclear.slice(0,4).map(c=>`<button data-hold="${{c.id}}">${{esc(c.headline)}}</button>`).join('')}}</div>`; document.querySelectorAll('[data-hold]').forEach(btn=>btn.onclick=()=>{{selected=btn.dataset.hold; render()}})}}
function renderTabs(items){{const counts={{now:0,watch:0,unconfirmed:0}}; items.forEach(c=>counts[bucket(c)]++); document.getElementById('tabs').innerHTML=[['now','Now'],['watch','Watch'],['unconfirmed','Unconfirmed']].map(([id,label])=>`<button class="${{feedMode===id?'active':''}}" data-tab="${{id}}"><span>${{label}}</span><b>${{counts[id]}}</b></button>`).join(''); document.querySelectorAll('[data-tab]').forEach(btn=>btn.onclick=()=>{{feedMode=btn.dataset.tab; render()}})}}
function renderTrust(items){{const confirmed=items.filter(c=>c.confirmation_status==='corroborated').length; const claimed=items.filter(c=>c.confirmation_status==='single-source').length; const unplaced=items.filter(c=>c.location_precision==='unknown').length; document.getElementById('trust').innerHTML=`<div><span>Confirmed</span><b>${{confirmed}}</b></div><div><span>Claimed</span><b>${{claimed}}</b></div><div><span>Unplaced</span><b>${{unplaced}}</b></div>`}}
function renderFreshness(){{const node=document.getElementById('freshness'); const generated=new Date(data.generatedAt||Date.now()); const ageMs=Date.now()-generated.getTime(); const ageHours=Math.max(0,ageMs/36e5); const ageLabel=ageHours<1?`${{Math.max(1,Math.round(ageHours*60))}} min old`:`${{ageHours.toFixed(ageHours<10?1:0)}} hr old`; const state=ageHours>6?'stale':'fresh'; node.dataset.state=state; node.innerHTML=`<span>Last refresh</span><p>${{generated.toLocaleString('en',{{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}})}}. ${{state==='stale'?'Refresh the feed before relying on this as a current read.':'Fresh enough for orientation, still review before acting.'}}</p><b>${{ageLabel}}</b><button id="refreshDesk" type="button">Refresh now</button>`; const refresh=document.getElementById('refreshDesk'); refresh.onclick=async()=>{{refresh.disabled=true; refresh.textContent='Refreshing'; try{{const res=await fetch('/refresh',{{method:'POST'}}); if(!res.ok) throw new Error('Refresh failed'); refresh.textContent='Reloading'; location.reload()}}catch(err){{refresh.textContent='Refresh failed'; refresh.disabled=false}}}}}}
function renderFocusNote(items){{const held=filtered().length-items.length; const node=document.getElementById('focusNote'); if(held<1){{node.classList.remove('visible'); node.innerHTML=''; return}} node.classList.add('visible'); node.innerHTML=`<span>Lebanon focus</span><p>${{held}} regional item${{held===1?'':'s'}} held back from the desk because ${{held===1?'it does':'they do'}} not mention Lebanon, Hezbollah, or a named Lebanese place.</p>`}}
function renderPriority(items){{const danger=items.find(c=>['critical','high'].includes(c.severity)&&c.location_precision!=='unknown')||items.find(c=>['critical','high'].includes(c.severity)); const fragile=items.find(c=>(c.confirmation_status==='single-source'||c.location_precision==='unknown')&&c.id!==danger?.id)||items.find(c=>c.confirmation_status==='single-source'||c.location_precision==='unknown'); const cards=[['Danger to verify',danger, danger?`${{danger.where||danger.primary_location?.name||'Location unclear'}}: ${{danger.headline}}`:'No active danger item surfaced','Check local and opposing-source confirmation before treating this as movement guidance.'],['Fragile claim',fragile, fragile?fragile.headline:'No fragile claim surfaced','Treat single-source and unplaced items as leads, not facts.'],['Full read',null,'Open the full Morning Brief','Outlet watch, confidence bars, map notes, seven-day signal, and verification gaps in one printable packet.']]; document.getElementById('priority').innerHTML=cards.map(([label,item,title,copy],index)=>`<article><span>${{label}}</span><strong>${{esc(title)}}</strong><p>${{esc(copy)}}</p><button data-priority="${{item?.id||''}}" data-priority-index="${{index}}">${{index===2?'Open brief':'Open item'}}</button></article>`).join(''); document.querySelectorAll('[data-priority]').forEach(btn=>btn.onclick=()=>{{if(btn.dataset.priorityIndex==='2'){{document.getElementById('openBrief').click(); return}} if(btn.dataset.priority){{selected=btn.dataset.priority; render()}}}})}}
function timelineData(items){{const days=[]; const now=new Date(data.generatedAt||Date.now()); for(let i=6;i>=0;i--){{const d=new Date(now); d.setDate(now.getDate()-i); const key=d.toISOString().slice(0,10); days.push({{key,label:d.toLocaleDateString('en',{{weekday:'short'}}),count:0,critical:0}})}} items.forEach(c=>{{const key=new Date(c.published_at).toISOString().slice(0,10); const row=days.find(d=>d.key===key); if(row){{row.count++; if(['critical','high'].includes(c.severity)) row.critical++}}}}); return days}}
function renderTimeline(items){{const days=timelineData(items); const max=Math.max(1,...days.map(d=>d.count)); const peak=days.reduce((a,b)=>b.count>a.count?b:a,days[0]); const bars=days.map(d=>`<div class="timeline-day" data-hot="${{d.critical>0}}" title="${{d.count}} dossiers, ${{d.critical}} high-risk"><i style="height:${{Math.max(5,Math.round((d.count/max)*76))}}px"></i><b>${{d.count}}</b><span>${{d.label}}</span></div>`).join(''); document.getElementById('timeline').innerHTML=`<div><span class="over">Seven-day signal</span><h2>${{peak.count ? `${{peak.label}} is the loudest day in this run` : 'No clear surge in this run'}}</h2><p>${{peak.count}} dossiers appear on the busiest day. Red bars include high-risk or critical items.</p></div><div class="timeline-bars">${{bars}}</div>`}}
function renderFeed(items){{const list=items.filter(c=>bucket(c)===feedMode); const shown=list.length?list:items.slice(0,5); document.getElementById('feed').innerHTML=shown.map(c=>`<button class="${{selected===c.id?'active':''}}" data-id="${{c.id}}"><span class="feed-top"><span>${{esc(c.primary_location?.name||'Location unclear')}}</span><i>${{statusLabel(c.confirmation_status)}}</i></span><strong>${{esc(c.headline)}}</strong><small>${{esc(c.recommended_next_check||c.what_to_watch)}}</small></button>`).join(''); document.querySelectorAll('[data-id]').forEach(btn=>btn.onclick=()=>{{selected=btn.dataset.id; render()}})}}
function row(title, html){{return `<div><dt>${{title}}</dt><dd>${{html}}</dd></div>`}}
function renderDossier(items){{const c=items.find(x=>x.id===selected)||items[0]; if(!c) return; selected=c.id; const links=(c.urls||[]).slice(0,4).map((u,i)=>`<a href="${{esc(u)}}" target="_blank" rel="noreferrer">Source ${{i+1}}</a>`).join(' '); const says=(c.who_says_so||[]).map(x=>`<li>${{esc(x)}}</li>`).join(''); const complicates=(c.who_disputes_or_complicates||[]).map(x=>`<li>${{esc(x)}}</li>`).join(''); document.getElementById('dossier').innerHTML=`<div class="dossier-head"><div><span class="over">Selected dossier</span><h2>${{esc(c.headline)}}</h2></div><div class="badges"><span>${{esc(c.severity)}}</span><span>${{statusLabel(c.confirmation_status)}}</span><span>${{esc(c.location_precision)}}</span></div></div><dl class="dossier-grid">${{row('What happened',esc(c.what_happened||c.analysis))}}${{row('Where',esc(c.where||c.primary_location?.name||'Location unclear'))}}${{row('Who says so',`<ul>${{says}}</ul>`)}}${{row('Who complicates it',`<ul>${{complicates}}</ul>`)}}${{row('Why it matters',esc(c.why_it_matters||c.analysis))}}${{row('What is missing',esc(c.what_is_missing))}}${{row('Next check',esc(c.recommended_next_check||c.what_to_watch))}}${{row('Links',links)}}</dl>`}}
function renderCards(items){{document.getElementById('shown').textContent=items.length+' shown'; document.getElementById('cards').innerHTML=items.map(c=>`<button class="card ${{selected===c.id?'active':''}}" data-card="${{c.id}}"><span class="feed-top"><span>${{esc(c.primary_location?.name||'Unlocated')}}</span><i>${{statusLabel(c.confirmation_status)}}</i></span><strong>${{esc(c.headline)}}</strong><p>${{esc(c.what_happened||c.analysis)}}</p><small>${{esc((c.source_lanes||[]).map(x=>laneLabels[x]||x).join(' / ')||'source unclear')}}</small></button>`).join(''); document.querySelectorAll('[data-card]').forEach(btn=>btn.onclick=()=>{{selected=btn.dataset.card; render()}})}}
function renderConfirm(items){{const count=items.filter(c=>c.confirmation_status!=='corroborated').length; document.getElementById('unconfirmed').textContent=count+' dossiers still need another source, a sharper place, or a local record. They remain visible because silence can also be dangerous, but the page marks them before it asks anyone to believe them.'}}
function renderBrief(items){{const lead=items[0]||clusters[0]; if(!lead) return; const confirmed=items.filter(c=>c.confirmation_status==='corroborated').length; const claimed=items.filter(c=>c.confirmation_status==='single-source').length; const unplaced=items.filter(c=>c.location_precision==='unknown').length; const date=new Date(data.generatedAt||Date.now()).toLocaleString('en',{{month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'}}); document.getElementById('briefDate').textContent=`Generated ${{date}} from ${{data.meta?.source_count||0}} sources. Read as a field brief, not as an emergency instruction.`; const outletRows=sourceLanes.filter(l=>l.item_count>0).slice(0,7).map(l=>`<tr><th>${{esc(l.label)}}</th><td>${{esc(l.items?.[0]?.title||'No lead item')}}</td><td>${{l.item_count}}</td></tr>`).join(''); const verify=items.filter(c=>c.confirmation_status!=='corroborated'||c.location_precision==='unknown').slice(0,5).map(c=>`<li>${{esc(c.headline)}}<br><small>${{esc(c.what_is_missing||c.recommended_next_check)}}</small></li>`).join(''); const bars=[['Confirmed',confirmed,items.length],['Claimed',claimed,items.length],['Unplaced',unplaced,items.length]].map(([label,count,total])=>`<div class="brief-bar"><span>${{label}}</span><i><span style="width:${{Math.max(4,Number(count)/Math.max(1,Number(total))*100)}}%"></span></i><b>${{count}}</b></div>`).join(''); const days=timelineData(items); const max=Math.max(1,...days.map(d=>d.count)); const signal=days.map(d=>`<div><i style="height:${{Math.max(4,Math.round((d.count/max)*84))}}px"></i><span>${{d.label}} ${{d.count}}</span></div>`).join(''); document.getElementById('briefBody').innerHTML=`<section class="brief-box"><span class="over">Lead watch</span><h2>${{esc(lead.headline)}}</h2><p>${{esc(lead.why_it_matters||lead.what_happened||lead.analysis)}}</p></section><div class="brief-grid"><section class="brief-box"><h3>Outlet watch</h3><table class="brief-table"><thead><tr><th>Lane</th><th>Main item</th><th>Items</th></tr></thead><tbody>${{outletRows}}</tbody></table></section><section class="brief-box"><h3>Confidence</h3><div class="brief-bars">${{bars}}</div><h3>Seven-day signal</h3><div class="brief-signal">${{signal}}</div></section><section class="brief-box"><h3>What to verify</h3><ul>${{verify}}</ul></section><section class="brief-box"><h3>Map note</h3><p>${{mappedNote(items)}}</p><div class="mini-map"></div></section></div>`}}
function mappedNote(items){{const mapped=items.filter(c=>c.location_precision!=='unknown').length; const unplaced=items.length-mapped; return `${{mapped}} dossiers have enough location detail to map. ${{unplaced}} stay unpinned because a wrong point is worse than no point.`}}
document.querySelectorAll('.ground').forEach(btn=>btn.onclick=()=>{{const ids=(btn.dataset.related||'').split(','); const next=ids.find(id=>filtered().some(c=>c.id===id)); if(next){{selected=next; render()}}}})
document.getElementById('openBrief').onclick=()=>{{renderBrief(filtered()); document.getElementById('briefModal').classList.add('open'); document.getElementById('briefModal').setAttribute('aria-hidden','false')}}
document.getElementById('closeBrief').onclick=()=>{{document.getElementById('briefModal').classList.remove('open'); document.getElementById('briefModal').setAttribute('aria-hidden','true')}}
document.getElementById('printBrief').onclick=()=>{{renderBrief(filtered()); window.print()}}
document.getElementById('briefModal').onclick=(event)=>{{if(event.target.id==='briefModal') document.getElementById('closeBrief').click()}}
function render(){{const items=filtered().filter(isLebanonSignal); renderFreshness(); renderFocusNote(items); renderPriority(items); renderTimeline(items); renderLayers(); renderMap(items); renderHolding(items); renderTrust(items); renderTabs(items); renderFeed(items); renderDossier(items); renderCards(items); renderConfirm(items); renderBrief(items)}}
render();
</script>
</main></body></html>"""
    return body.encode("utf-8")


class Handler(BaseHTTPRequestHandler):
    def send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_page(self, with_body: bool) -> None:
        body = render_page()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if with_body:
            self.wfile.write(body)

    def send_static(self, path: Path, content_type: str, with_body: bool = True) -> None:
        if not path.exists():
            self.send_response(404)
            self.end_headers()
            return
        body = path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if with_body:
            self.wfile.write(body)

    def do_GET(self) -> None:
        if self.path in {"/", "/signal-desk"}:
            self.send_page(with_body=True)
            return
        if self.path == "/vendor/leaflet.css":
            self.send_static(LEAFLET_DIR / "leaflet.css", "text/css; charset=utf-8")
            return
        if self.path == "/vendor/leaflet.js":
            self.send_static(LEAFLET_DIR / "leaflet.js", "application/javascript; charset=utf-8")
            return
        if self.path.startswith("/vendor/images/"):
            self.send_static(LEAFLET_DIR / "images" / Path(self.path).name, "image/png")
            return
        if self.path == "/favicon.ico":
            self.send_response(204)
            self.end_headers()
            return
        self.send_response(404)
        self.end_headers()

    def do_POST(self) -> None:
        if self.path == "/refresh":
            try:
                proc = subprocess.run(
                    ["python3", "-m", "tools.signal_desk.run", "--since", "7d"],
                    cwd=ROOT,
                    text=True,
                    capture_output=True,
                    timeout=180,
                )
            except subprocess.TimeoutExpired:
                self.send_json(504, {"ok": False, "error": "Refresh timed out after 180 seconds."})
                return
            self.send_json(
                200 if proc.returncode == 0 else 500,
                {
                    "ok": proc.returncode == 0,
                    "stdout": proc.stdout[-4000:],
                    "stderr": proc.stderr[-4000:],
                },
            )
            return
        self.send_response(404)
        self.end_headers()

    def do_HEAD(self) -> None:
        if self.path in {"/", "/signal-desk"}:
            self.send_page(with_body=False)
            return
        if self.path == "/vendor/leaflet.css":
            self.send_static(LEAFLET_DIR / "leaflet.css", "text/css; charset=utf-8", with_body=False)
            return
        if self.path == "/vendor/leaflet.js":
            self.send_static(LEAFLET_DIR / "leaflet.js", "application/javascript; charset=utf-8", with_body=False)
            return
        if self.path.startswith("/vendor/images/"):
            self.send_static(LEAFLET_DIR / "images" / Path(self.path).name, "image/png", with_body=False)
            return
        if self.path == "/favicon.ico":
            self.send_response(204)
            self.end_headers()
            return
        self.send_response(404)
        self.end_headers()

    def log_message(self, fmt: str, *args: object) -> None:
        print(fmt % args)


def main() -> None:
    server = ThreadingHTTPServer(("127.0.0.1", 3012), Handler)
    print("Signal Desk preview: http://127.0.0.1:3012/signal-desk", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
