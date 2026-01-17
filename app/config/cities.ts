export const CITIES = [
  { label: "Dallol", query: "Dallol, Ethiopia", slug: "dallol" },
  { label: "Fairbanks", query: "Fairbanks, United States", slug: "fairbanks" },
  { label: "Londres", query: "London, United Kingdom", slug: "londres" },
  { label: "Recife", query: "Recife, Brazil", slug: "recife" },
  { label: "Vancouver", query: "Vancouver, Canada", slug: "vancouver" },
  { label: "Yakutsk", query: "Yakutsk, Russia", slug: "yakutsk" },
] as const;

export type CityConfig = (typeof CITIES)[number];
