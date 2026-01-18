"use client";

import Link from "next/link";
import Image from "next/image";
import type { CityConfig } from "../config/cities";
import GlobeImage from "../la_globe-americas.png";

interface CitySelectionPageProps {
  cities: CityConfig[];
}

export function CitySelectionPage({ cities }: CitySelectionPageProps) {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Weather</h1>
        <p className="text-gray-400 text-sm">Select a city</p>
      </header>

      <section className="mb-12" aria-label="Weather app logo">
        <div className="relative w-[176px] h-[176px] flex items-center justify-center rounded-full  overflow-hidden">
          <Image
            src={GlobeImage}
            alt="Globo terrestre"
            className="object-contain w-full h-full"
            priority
          />
        </div>
      </section>

      <section
        className="grid grid-cols-3 gap-x-8 gap-y-12 max-w-md w-full text-center"
        aria-label="Lista de cidades disponíveis"
      >
        {cities.map((city) => (
          <Link
            key={city.label}
            href={`/city/${city.slug}`}
            className="text-sm font-bold hover:text-blue-400 transition-colors tracking-wider capitalize"
          >
            {city.label}
          </Link>
        ))}
      </section>
    </main>
  );
}
