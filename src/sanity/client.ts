import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "cc4vt6z9",
  dataset: "production",
  apiVersion: "2026-05-15",
  useCdn: false,
});
