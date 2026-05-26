"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  CircleHelp,
  Clock3,
  Compass,
  Eye,
  Filter,
  ListChecks,
  MapPinned,
  Megaphone,
  RadioTower,
  ShieldAlert,
} from "lucide-react";
import type { DistrictGeoJson, GroundNeed, SignalCluster, SignalDeskApi, SignalGeoJson } from "@/lib/signal-desk";

const SignalDeskMap = dynamic(
  () => import("@/components/signal-desk/signal-desk-map").then((mod) => mod.SignalDeskMap),
  {
    ssr: false,
    loading: () => <div className="signal-map-loading">Drawing Lebanon...</div>,
  },
);

const layers = [
  { id: "danger", label: "Danger" },
  { id: "displacement", label: "Displacement" },
  { id: "claims", label: "Claims" },
  { id: "services", label: "Civilian services" },
  { id: "narrative", label: "Narrative" },
];

const lanes: Record<string, string> = {
  "israeli-establishment": "Israeli establishment",
  "israeli-dissent": "Israeli dissent",
  "lebanese-local": "Lebanese local",
  "resistance-apparatus": "Resistance apparatus",
  "palestinian-record": "Palestinian record",
  "gulf-official": "Gulf official line",
  "iranian-state": "Iranian state line",
  "wires-regional": "Wires and regionals",
  "video-analysis": "Video analysis",
  "framework-desk": "Framework desk",
};

const timeWindows = [
  { label: "24h", days: 1 },
  { label: "3d", days: 3 },
  { label: "7d", days: 7 },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusLabel(status: string) {
  if (status === "corroborated") return "Corroborated";
  if (status === "partly-corroborated") return "Partly corroborated";
  if (status === "single-source") return "Single source";
  return "Unconfirmed";
}

function layerIds(cluster: SignalCluster) {
  const ids = new Set<string>();
  const tags = cluster.signal_tags;
  if (cluster.severity === "critical" || cluster.severity === "high" || tags.includes("strike-claim") || tags.includes("casualty")) {
    ids.add("danger");
  }
  if (tags.includes("displacement") || cluster.civilian_impact_flags.some((flag) => ["evacuation", "displacement"].includes(flag))) {
    ids.add("displacement");
  }
  if (cluster.confirmation_status === "single-source" || cluster.confirmation_status === "unconfirmed" || cluster.source_lanes.includes("resistance-apparatus")) {
    ids.add("claims");
  }
  if (cluster.civilian_impact_flags.some((flag) => ["roads", "hospitals", "schools", "water", "electricity", "telecoms"].includes(flag))) {
    ids.add("services");
  }
  if (tags.includes("rhetoric-shift") || tags.includes("political-maneuver") || cluster.source_lanes.includes("israeli-dissent") || cluster.source_lanes.includes("framework-desk")) {
    ids.add("narrative");
  }
  if (!ids.size) ids.add("narrative");
  return ids;
}

type FeedMode = "now" | "watch" | "unconfirmed";

function cockpitBucket(cluster: SignalCluster): FeedMode {
  if (cluster.confirmation_status === "single-source" || cluster.confirmation_status === "unconfirmed" || cluster.location_precision !== "exact") {
    return "unconfirmed";
  }
  if (cluster.severity === "critical" || cluster.severity === "high") {
    return "now";
  }
  return "watch";
}

function sourceLine(cluster: SignalCluster) {
  if (cluster.source_lanes.length) {
    return cluster.source_lanes.map((lane) => lanes[lane] ?? lane).join(" / ");
  }
  return cluster.sources_span.join(" / ") || "source unclear";
}

function DossierRow({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="signal-dossier-row">
      <dt>{title}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export function SignalDeskDashboard({
  api,
  events,
  districts,
}: {
  api: SignalDeskApi;
  events: SignalGeoJson;
  districts: DistrictGeoJson;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(api.clusters[0]?.id ?? null);
  const [activeLayers, setActiveLayers] = useState<Set<string>>(new Set(["danger", "claims", "displacement"]));
  const [windowDays, setWindowDays] = useState(7);
  const [feedMode, setFeedMode] = useState<FeedMode>("now");
  const generatedAtMs = useMemo(() => new Date(api.meta.generated_at).getTime(), [api.meta.generated_at]);

  const filteredClusters = useMemo(() => {
    const cutoff = generatedAtMs - windowDays * 24 * 60 * 60 * 1000;
    return api.clusters.filter((cluster) => {
      const timeMatch = new Date(cluster.published_at).getTime() >= cutoff;
      const clusterLayers = layerIds(cluster);
      const layerMatch = activeLayers.size === 0 || [...activeLayers].some((layer) => clusterLayers.has(layer));
      return timeMatch && layerMatch;
    });
  }, [activeLayers, api.clusters, generatedAtMs, windowDays]);

  const feedClusters = useMemo(
    () => filteredClusters.filter((cluster) => cockpitBucket(cluster) === feedMode),
    [feedMode, filteredClusters],
  );

  const selectedCluster =
    filteredClusters.find((cluster) => cluster.id === selectedId) ??
    filteredClusters[0] ??
    null;

  const unclearClusters = useMemo(
    () => filteredClusters.filter((cluster) => cluster.location_precision === "unknown"),
    [filteredClusters],
  );

  const counts = useMemo(() => {
    const current: Record<FeedMode, number> = { now: 0, watch: 0, unconfirmed: 0 };
    for (const cluster of filteredClusters) {
      current[cockpitBucket(cluster)] += 1;
    }
    return current;
  }, [filteredClusters]);

  const trustCounts = useMemo(
    () => ({
      confirmed: filteredClusters.filter((cluster) => cluster.confirmation_status === "corroborated").length,
      claimed: filteredClusters.filter((cluster) => cluster.confirmation_status === "single-source").length,
      unclear: unclearClusters.length,
    }),
    [filteredClusters, unclearClusters.length],
  );

  function toggleLayer(layer: string) {
    setActiveLayers((current) => {
      const next = new Set(current);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return next;
    });
  }

  function selectGroundNeed(need: GroundNeed) {
    const next = need.related_clusters.find((id) => filteredClusters.some((cluster) => cluster.id === id));
    if (next) setSelectedId(next);
  }

  return (
    <section className="signal-desk-page" aria-label="Lebanese Academic Signal Desk">
      <div className="signal-desk-frame">
        <header className="signal-desk-cockpit-head">
          <div>
            <span className="signal-kicker">
              <RadioTower size={16} strokeWidth={1.7} />
              Lebanon field brief
            </span>
            <h1>Signal Desk</h1>
          </div>
          <p>
            A review-first map for Lebanon: what changed, where it changed, who says so, who complicates it, and what needs checking before anyone trusts the claim.
          </p>
          <dl className="signal-hero-stats" aria-label="Signal desk run statistics">
            <div>
              <dt>Dossiers</dt>
              <dd>{api.meta.cluster_count}</dd>
            </div>
            <div>
              <dt>Sources</dt>
              <dd>{api.meta.source_count}</dd>
            </div>
            <div>
              <dt>Mapped</dt>
              <dd>{events.features.length}</dd>
            </div>
          </dl>
        </header>

        <div className="signal-cockpit-grid">
          <section className="signal-map-panel" aria-label="Interactive Lebanon field map">
            <div className="signal-panel-top">
              <div>
                <span className="signal-overline">Terrain map</span>
                <h2>Where the pressure is</h2>
              </div>
              <span className="signal-generated">
                <Clock3 size={14} /> {formatDate(api.meta.generated_at)}
              </span>
            </div>
            <div className="signal-map-wrap">
              <SignalDeskMap
                clusters={filteredClusters}
                districts={districts}
                selectedId={selectedCluster?.id ?? null}
                onSelect={setSelectedId}
              />
              <div className="signal-map-legend">
                <span><i data-kind="solid" /> exact place</span>
                <span><i data-kind="halo" /> district or halo</span>
              </div>
            </div>
            {unclearClusters.length ? (
              <div className="signal-map-holding" aria-label="Unlocated claims">
                <span>Location unclear</span>
                <div>
                  {unclearClusters.slice(0, 3).map((cluster) => (
                    <button key={cluster.id} type="button" onClick={() => setSelectedId(cluster.id)}>
                      {cluster.headline}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="signal-controls">
              <div className="signal-control-block">
                <span><Filter size={14} /> Layers</span>
                <div className="signal-chip-row">
                  {layers.map((layer) => (
                    <button
                      key={layer.id}
                      type="button"
                      className="signal-chip"
                      data-active={activeLayers.has(layer.id)}
                      onClick={() => toggleLayer(layer.id)}
                    >
                      {layer.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="signal-control-block">
                <span><Activity size={14} /> Window</span>
                <div className="signal-chip-row">
                  {timeWindows.map((window) => (
                    <button
                      key={window.label}
                      type="button"
                      className="signal-chip signal-chip-small"
                      data-active={windowDays === window.days}
                      onClick={() => setWindowDays(window.days)}
                    >
                      {window.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <aside className="signal-decision-panel" aria-label="Now, watch, and unconfirmed feed">
            <div className="signal-brief-header">
              <span className="signal-overline">Decision cockpit</span>
              <span>{api.meta.mode}</span>
            </div>
            <div className="signal-trust-strip" aria-label="Confirmation summary">
              <div>
                <span>Confirmed</span>
                <strong>{trustCounts.confirmed}</strong>
              </div>
              <div>
                <span>Claimed</span>
                <strong>{trustCounts.claimed}</strong>
              </div>
              <div>
                <span>Unplaced</span>
                <strong>{trustCounts.unclear}</strong>
              </div>
            </div>
            <div className="signal-feed-tabs" role="tablist" aria-label="Signal feed modes">
              {([
                ["now", "Now", counts.now],
                ["watch", "Watch", counts.watch],
                ["unconfirmed", "Unconfirmed", counts.unconfirmed],
              ] as Array<[FeedMode, string, number]>).map(([id, label, count]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={feedMode === id}
                  data-active={feedMode === id}
                  onClick={() => setFeedMode(id)}
                >
                  <span>{label}</span>
                  <strong>{count}</strong>
                </button>
              ))}
            </div>
            <div className="signal-feed-list">
              {(feedClusters.length ? feedClusters : filteredClusters.slice(0, 5)).map((cluster) => (
                <button
                  key={`${feedMode}-${cluster.id}`}
                  type="button"
                  className="signal-feed-item"
                  data-active={selectedCluster?.id === cluster.id}
                  onClick={() => setSelectedId(cluster.id)}
                >
                  <span className="signal-feed-top">
                    <span>{cluster.primary_location?.name ?? "Location unclear"}</span>
                    <i data-status={cluster.confirmation_status}>{statusLabel(cluster.confirmation_status)}</i>
                  </span>
                  <strong>{cluster.headline}</strong>
                  <small>{cluster.recommended_next_check || cluster.what_to_watch}</small>
                </button>
              ))}
            </div>
            <div className="signal-honesty-strip">
              <ShieldAlert size={17} />
              <span>Hezbollah, IDF, and Telegram items are claims until another lane confirms place, time, and effect.</span>
            </div>
          </aside>
        </div>

        <div className="signal-action-row" aria-label="Ground checks">
          {api.ground_needs.map((need) => (
            <button key={need.id} type="button" onClick={() => selectGroundNeed(need)}>
              <span><Compass size={15} /> {need.label}</span>
              <strong>{need.answer}</strong>
              <small>{need.check}</small>
            </button>
          ))}
        </div>

        {selectedCluster ? (
          <section className="signal-dossier-section" aria-label="Selected event dossier">
            <div className="signal-dossier-head">
              <div>
                <span className="signal-overline">Selected dossier</span>
                <h2>{selectedCluster.headline}</h2>
              </div>
              <div className="signal-dossier-badges">
                <span data-severity={selectedCluster.severity}><AlertTriangle size={14} /> {selectedCluster.severity}</span>
                <span data-status={selectedCluster.confirmation_status}><ListChecks size={14} /> {statusLabel(selectedCluster.confirmation_status)}</span>
                <span><MapPinned size={14} /> {selectedCluster.location_precision}</span>
              </div>
            </div>
            <dl className="signal-dossier-grid">
              <DossierRow title="What happened">{selectedCluster.what_happened || selectedCluster.analysis}</DossierRow>
              <DossierRow title="Where">{selectedCluster.where || selectedCluster.primary_location?.name || "Location unclear"}</DossierRow>
              <DossierRow title="Who says so">
                <ul>{selectedCluster.who_says_so.map((source) => <li key={source}>{source}</li>)}</ul>
              </DossierRow>
              <DossierRow title="Who complicates it">
                <ul>{selectedCluster.who_disputes_or_complicates.map((source) => <li key={source}>{source}</li>)}</ul>
              </DossierRow>
              <DossierRow title="Why it matters">{selectedCluster.why_it_matters || selectedCluster.analysis}</DossierRow>
              <DossierRow title="What is missing">{selectedCluster.what_is_missing}</DossierRow>
              <DossierRow title="Next check">{selectedCluster.recommended_next_check || selectedCluster.what_to_watch}</DossierRow>
              <DossierRow title="Links">
                <div className="signal-link-stack">
                  {selectedCluster.urls.slice(0, 4).map((url, index) => (
                    <a key={url} href={url} target="_blank" rel="noreferrer">
                      Source {index + 1}
                    </a>
                  ))}
                </div>
              </DossierRow>
            </dl>
          </section>
        ) : null}

        <section className="signal-lane-section" aria-label="Source lanes">
          <div className="signal-section-heading">
            <div>
              <span className="signal-overline">Source lanes</span>
              <h2>Who is telling the story</h2>
            </div>
            <span>{api.source_lanes.length} lanes</span>
          </div>
          <div className="signal-lane-grid">
            {api.source_lanes.map((lane) => (
              <article key={lane.id} className="signal-lane-card">
                <div className="signal-lane-top">
                  <span>{lane.label}</span>
                  <strong>{lane.item_count}</strong>
                </div>
                <h3>{lane.question}</h3>
                <p>{lane.role}</p>
                <div className="signal-lane-items">
                  {lane.items.length ? (
                    lane.items.slice(0, 3).map((item) => (
                      <a key={`${lane.id}-${item.url}-${item.title}`} href={item.url} target="_blank" rel="noreferrer">
                        <span>{item.source}</span>
                        <strong>{item.title}</strong>
                      </a>
                    ))
                  ) : (
                    <em>No current items in this lane.</em>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="signal-cluster-section" aria-label="All event dossiers">
          <div className="signal-section-heading">
            <div>
              <span className="signal-overline">Dossier index</span>
              <h2>All visible events</h2>
            </div>
            <span>{filteredClusters.length} shown</span>
          </div>
          <div className="signal-cluster-grid">
            {filteredClusters.map((cluster) => (
              <button
                key={cluster.id}
                type="button"
                className="signal-cluster-card"
                data-active={selectedCluster?.id === cluster.id}
                onClick={() => setSelectedId(cluster.id)}
              >
                <span className="signal-card-top">
                  <span className="signal-card-location">
                    <MapPinned size={14} />
                    {cluster.primary_location?.name ?? "Unlocated"}
                  </span>
                  <span className="signal-confidence" data-confidence={cluster.confidence}>
                    {statusLabel(cluster.confirmation_status)}
                  </span>
                </span>
                <strong>{cluster.headline}</strong>
                <span className="signal-card-analysis">{cluster.what_happened || cluster.analysis}</span>
                <span className="signal-framework-row">
                  {cluster.civilian_impact_flags.length ? (
                    cluster.civilian_impact_flags.slice(0, 3).map((flag) => <i key={flag}>{flag}</i>)
                  ) : (
                    <i>{cluster.claim_side}</i>
                  )}
                </span>
                <span className="signal-bias-row">{sourceLine(cluster)}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="signal-could-not-confirm" aria-label="What could not be confirmed">
          <CircleHelp size={18} />
          <div>
            <h2>What I could not confirm</h2>
            <p>
              {filteredClusters.filter((cluster) => cluster.confirmation_status !== "corroborated").length} dossiers still need another source, a sharper place, or a local record. They remain visible because silence can also be dangerous, but the page marks them before it asks anyone to believe them.
            </p>
          </div>
          <Eye size={18} />
          <Megaphone size={18} />
          <CheckCircle2 size={18} />
        </section>
      </div>
    </section>
  );
}
