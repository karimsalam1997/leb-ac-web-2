import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { client } from "./client";

const { projectId, dataset } = client.config();

export function urlFor(source: SanityImageSource) {
  return projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset }).image(source)
    : null;
}
