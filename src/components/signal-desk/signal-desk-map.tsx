"use client";

import { Circle, GeoJSON, MapContainer, CircleMarker, Popup, TileLayer, Tooltip } from "react-leaflet";
import type { PathOptions } from "leaflet";
import type { GeoJsonObject } from "geojson";
import type { DistrictGeoJson, SignalCluster } from "@/lib/signal-desk";

function districtColor(count: number) {
  if (count >= 5) return "#f06b31";
  if (count >= 3) return "#c9562d";
  if (count >= 1) return "#8b3b28";
  return "#29221d";
}

function tagColor(tag: string) {
  if (tag === "strike-claim") return "#f06b31";
  if (tag === "displacement") return "#e9b86e";
  if (tag === "economic") return "#7fa7a0";
  if (tag === "heritage") return "#b98a58";
  if (tag === "casualty") return "#d94b3d";
  return "#f5e7d0";
}

function severityColor(severity: string, fallback: string) {
  if (severity === "critical") return "#ff4d36";
  if (severity === "high") return "#f06b31";
  if (severity === "moderate") return "#e9b86e";
  return fallback;
}

export function SignalDeskMap({
  clusters,
  districts,
  selectedId,
  onSelect,
}: {
  clusters: SignalCluster[];
  districts: DistrictGeoJson;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const counts = new Map<string, number>();
  clusters.forEach((cluster) => {
    const district = cluster.primary_location?.district;
    if (district) {
      counts.set(district, (counts.get(district) ?? 0) + 1);
    }
  });

  return (
    <MapContainer
      center={[33.86, 35.72]}
      zoom={8}
      minZoom={7}
      maxZoom={13}
      maxBounds={[[32.8, 34.65], [34.85, 36.85]]}
      maxBoundsViscosity={0.86}
      scrollWheelZoom={false}
      className="signal-map"
      attributionControl
    >
      <TileLayer
        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        opacity={0.64}
        attribution='Map data: &copy; OpenStreetMap contributors, SRTM | Style: &copy; OpenTopoMap'
      />
      {districts.features.length ? (
        <GeoJSON
          data={districts as GeoJsonObject}
          style={(feature) => {
            const district = String(feature?.properties?.district ?? "");
            const count = counts.get(district) ?? 0;
            return {
              color: "rgba(245, 231, 208, 0.28)",
              fillColor: districtColor(count),
              fillOpacity: count ? 0.34 : 0.16,
              weight: 1,
            } satisfies PathOptions;
          }}
        />
      ) : null}
      {clusters.map((cluster, index) => {
        const location = cluster.primary_location;
        if (!location) return null;
        const isSelected = selectedId === cluster.id;
        if (cluster.location_precision === "unknown") {
          return null;
        }
        const isLowConfidence =
          cluster.confirmation_status === "single-source" ||
          cluster.confirmation_status === "unconfirmed" ||
          cluster.location_precision !== "exact" ||
          location.match_confidence < 0.5;
        const tag = cluster.signal_tags[0] ?? "political-maneuver";
        const color = severityColor(cluster.severity, tagColor(tag));
        if (isLowConfidence) {
          return (
            <Circle
              key={cluster.id}
              center={[location.lat, location.lng]}
              radius={cluster.location_precision === "national" ? 28000 : 13500}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: isSelected ? 0.16 : 0.08,
                opacity: isSelected ? 0.95 : 0.72,
                weight: isSelected ? 3 : 2,
                dashArray: "5 6",
              }}
              eventHandlers={{ click: () => onSelect(cluster.id) }}
              className="signal-map-halo"
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.96}>
                <span className="signal-map-tooltip">{location.name} / {cluster.confirmation_status}</span>
              </Tooltip>
              <Popup>
                <div className="signal-map-popup">
                  <strong>{cluster.headline}</strong>
                  <span>{location.name} / {cluster.location_precision}</span>
                  <p>{cluster.what_is_missing || cluster.recommended_next_check}</p>
                </div>
              </Popup>
            </Circle>
          );
        }
        return (
          <CircleMarker
            key={cluster.id}
            center={[location.lat, location.lng]}
            radius={isSelected ? 11 : 7}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: isSelected ? 0.95 : 0.72,
              opacity: 1,
              weight: isSelected ? 3 : 1.5,
            }}
            eventHandlers={{ click: () => onSelect(cluster.id) }}
            className="signal-map-pin"
            data-delay={index}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={0.96}>
              <span className="signal-map-tooltip">{location.name} / {cluster.confidence}</span>
            </Tooltip>
            <Popup>
              <div className="signal-map-popup">
                <strong>{cluster.headline}</strong>
                <span>{location.name} / {cluster.confirmation_status}</span>
                <p>{cluster.what_happened || cluster.analysis}</p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
