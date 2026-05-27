import "server-only";

import fs from "node:fs";
import path from "node:path";

export type SignalConfidence = "high" | "medium" | "low";
export type SignalSeverity = "critical" | "high" | "moderate" | "low";
export type SignalLocationPrecision = "exact" | "district" | "national" | "unknown";
export type SignalConfirmationStatus =
  | "corroborated"
  | "partly-corroborated"
  | "single-source"
  | "unconfirmed";

export type SignalLocation = {
  name: string;
  name_ar: string;
  district: string;
  caza: string;
  governorate: string;
  lat: number;
  lng: number;
  match_confidence: number;
};

export type SignalCluster = {
  id: string;
  item_ids: string[];
  headline: string;
  frameworks: string[];
  analysis: string;
  confidence: SignalConfidence;
  sources_span: string[];
  what_to_watch: string;
  signal_tags: string[];
  published_at: string;
  source_biases: string[];
  urls: string[];
  severity: SignalSeverity;
  location_precision: SignalLocationPrecision;
  civilian_impact_flags: string[];
  source_lanes: string[];
  claim_side: string;
  confirmation_status: SignalConfirmationStatus;
  recommended_next_check: string;
  what_happened: string;
  where: string;
  who_says_so: string[];
  who_disputes_or_complicates: string[];
  why_it_matters: string;
  what_is_missing: string;
  locations: SignalLocation[];
  primary_location: SignalLocation | null;
};

export type SignalFramework = {
  id: string;
  name: string;
  lens: string;
};

export type DistrictAggregate = {
  district: string;
  event_count: number;
  dominant_signal_tag: string;
};

export type SourceHealth = {
  source: string;
  ok: boolean;
  item_count: number;
  note: string;
};

export type SourceLaneItem = {
  title: string;
  source: string;
  source_type: string;
  url: string;
  published_at: string;
  signal_tags: string[];
  bias: string;
};

export type SourceLane = {
  id: string;
  label: string;
  question: string;
  role: string;
  item_count: number;
  sources: string[];
  items: SourceLaneItem[];
};

export type GroundNeed = {
  id: string;
  label: string;
  answer: string;
  check: string;
  related_clusters: string[];
};

export type SignalDeskApi = {
  meta: {
    generated_at: string;
    window_start: string;
    source_count: number;
    cluster_count: number;
    located_cluster_count: number;
    mode: string;
    notes: string[];
  };
  brief_markdown: string;
  clusters: SignalCluster[];
  district_aggregates: DistrictAggregate[];
  signal_tags: string[];
  frameworks: SignalFramework[];
  source_health: SourceHealth[];
  source_lanes: SourceLane[];
  ground_needs: GroundNeed[];
};

export type SignalGeoJson = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: {
      type: "Point";
      coordinates: [number, number];
    };
    properties: {
      cluster_id: string;
      headline: string;
      signal_tags: string[];
      confidence: SignalConfidence;
      frameworks: string[];
      district: string;
      analysis_short: string;
      published_at: string;
      match_confidence: number;
      severity: SignalSeverity;
      location_precision: SignalLocationPrecision;
      confirmation_status: SignalConfirmationStatus;
      claim_side: string;
      recommended_next_check: string;
      source_lanes: string[];
      civilian_impact_flags: string[];
      what_is_missing: string;
    };
  }>;
};

export type DistrictGeoJson = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: {
      district?: string;
      name?: string;
      shapeName?: string;
      [key: string]: unknown;
    };
    geometry: Record<string, unknown>;
  }>;
};

const emptyEvents: SignalGeoJson = {
  type: "FeatureCollection",
  features: [],
};

const emptyDistricts: DistrictGeoJson = {
  type: "FeatureCollection",
  features: [],
};

const dataDir = path.join(process.cwd(), "public", "data", "signal-desk");

function readJson<T>(filename: string, fallback: T): T {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) {
    return fallback;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

export function getSignalDeskData() {
  return {
    api: readJson<SignalDeskApi>("api.json", {
      meta: {
        generated_at: new Date().toISOString(),
        window_start: new Date().toISOString(),
        source_count: 0,
        cluster_count: 0,
        located_cluster_count: 0,
        mode: "empty",
        notes: ["Run python3 -m tools.signal_desk.run --only-rss --since 7d to generate dashboard data."],
      },
      brief_markdown:
        "# MENA Morning Brief\n\n## The one thing that matters today\nThe Signal Desk is waiting for its first local pipeline run.",
      clusters: [],
      district_aggregates: [],
      signal_tags: [],
      frameworks: [],
      source_health: [],
      source_lanes: [],
      ground_needs: [],
    }),
    events: readJson<SignalGeoJson>("events.geojson", emptyEvents),
    districts: readJson<DistrictGeoJson>("lebanon-districts.geojson", emptyDistricts),
  };
}
