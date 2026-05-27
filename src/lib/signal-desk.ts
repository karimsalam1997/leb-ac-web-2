export type SignalLocation = {
  name: string;
  name_ar?: string;
  district?: string;
  caza?: string;
  governorate?: string;
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
  confidence: string;
  sources_span: string[];
  what_to_watch: string;
  signal_tags: string[];
  published_at: string;
  source_biases: string[];
  urls: string[];
  severity: string;
  location_precision: string;
  civilian_impact_flags: string[];
  source_lanes: string[];
  claim_side: string;
  confirmation_status: string;
  recommended_next_check: string;
  what_happened: string;
  where: string;
  who_says_so: string[];
  who_disputes_or_complicates: string[];
  why_it_matters: string;
  what_is_missing: string;
  locations: SignalLocation[];
  primary_location?: SignalLocation | null;
  verification_status?: string;
  verification?: {
    label?: string;
    summary?: string;
    source_count?: number;
    source_lanes?: string[];
    location_precision?: string;
    missing_pieces?: string[];
    next_checks?: string[];
    provenance_trail?: string[];
  };
  map_marker_kind?: string;
  map_precision_label?: string;
  map_radius_meters?: number;
  map_warning?: string;
};

export type GroundNeed = {
  id: string;
  label: string;
  answer: string;
  check: string;
  related_clusters: string[];
};

export type SignalLaneItem = {
  source: string;
  title: string;
  url: string;
  published_at?: string;
};

export type SignalSourceLane = {
  id: string;
  label: string;
  item_count: number;
  question: string;
  role: string;
  items: SignalLaneItem[];
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
    [key: string]: unknown;
  };
  brief_markdown: string;
  clusters: SignalCluster[];
  ground_needs: GroundNeed[];
  source_lanes: SignalSourceLane[];
};

export type SignalGeoJson = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: unknown;
    properties: Record<string, unknown>;
  }>;
};

export type DistrictGeoJson = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    geometry: unknown;
    properties?: {
      district?: string;
      [key: string]: unknown;
    };
  }>;
};
