declare module "geojson" {
  export type GeoJsonObject = {
    type: string;
    [key: string]: unknown;
  };
}

declare module "leaflet" {
  export type PathOptions = Record<string, unknown>;
}

declare module "react-leaflet" {
  import type { ComponentType, ReactNode } from "react";

  type MapComponentProps = Record<string, unknown> & {
    children?: ReactNode;
  };

  export const Circle: ComponentType<MapComponentProps>;
  export const CircleMarker: ComponentType<MapComponentProps>;
  export const GeoJSON: ComponentType<MapComponentProps>;
  export const MapContainer: ComponentType<MapComponentProps>;
  export const Popup: ComponentType<MapComponentProps>;
  export const TileLayer: ComponentType<MapComponentProps>;
  export const Tooltip: ComponentType<MapComponentProps>;
}
