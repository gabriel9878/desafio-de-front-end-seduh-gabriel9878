"use client";

import { CitySelectionPage } from "./components/CitySelectionPage";
import { CITIES } from "./config/cities";

export default function HomePage() {
  return <CitySelectionPage cities={[...CITIES]} />;
}