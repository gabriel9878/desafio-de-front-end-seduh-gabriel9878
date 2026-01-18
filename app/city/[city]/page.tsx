import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CITIES, type CityConfig } from "@/app/config/cities";
import { WeatherDetailsPage } from "@/app/components/WeatherDetailsPage";

const API_KEY = process.env.WEATHER_API_KEY;

interface WeatherData {
  location: { name: string; country: string };
  current: {
    temp_c: number;
    condition: { text: string; code: number; icon: string };
    humidity: number;
    wind_kph: number;
    is_day: number;
  };
  forecast: {
    forecastday: Array<{
      astro: { sunrise: string; sunset: string };
      day: { maxtemp_c: number; mintemp_c: number };
      hour: Array<{
        time_epoch: number;
        temp_c: number;
        condition: { icon: string; text: string; code: number };
        time: string;
        is_day: number;
      }>;
    }>;
  };
}

// Necessário para SSG em rotas dinâmicas
export function generateStaticParams() {
  return CITIES.map((city) => ({
    city: city.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  return params.then(({ city }) => {
    const cityConfig = CITIES.find((c) => c.slug === city);

    if (!cityConfig) {
      return {
        title: "Cidade não encontrada | Weather App",
      } satisfies Metadata;
    }

    return {
      title: `${cityConfig.label} | Weather App`,
      description: `Previsão do tempo para ${cityConfig.label}.`,
    } satisfies Metadata;
  });
}

export default async function CityWeatherPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;

  const cityConfig: CityConfig | undefined = CITIES.find((c) => c.slug === city);

  if (!cityConfig) {
    return notFound();
  }

  let weather: WeatherData | null = null;

  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityConfig.query}&days=1&aqi=no&alerts=no`
    );

    if (!res.ok) {
      throw new Error("Falha ao buscar");
    }

    weather = await res.json();
  } catch (error) {
    console.error(error);
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Erro ao carregar dados. Verifique a chave da API.</p>
      </main>
    );
  }

  if (!weather) {
    return notFound();
  }

  return (
    <WeatherDetailsPage
      selectedCity={cityConfig.label}
      weather={weather}
    />
  );
}
