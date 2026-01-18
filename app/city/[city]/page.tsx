import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CITIES, type CityConfig } from "@/app/config/cities";
import { WeatherDetailsPage } from "@/app/components/WeatherDetailsPage";
import {
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudFog,
  Sun,
  MoonStar,
} from "lucide-react";

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

const getLucideIconForCondition = (code: number, isDay: number) => {
  const dayTime = isDay === 1;

  if (code === 1000) {
    return dayTime ? Sun : MoonStar;
  }

  if ([1003, 1006, 1009].includes(code)) {
    return dayTime ? CloudSun : CloudMoon;
  }

  if ([1030, 1135, 1147].includes(code)) {
    return CloudFog;
  }

  if (
    [
      1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198,
      1201, 1204, 1207, 1240, 1243, 1246, 1087, 1273, 1276, 1279, 1282,
    ].includes(code)
  ) {
    return CloudRain;
  }

  if (
    [
      1066, 1069, 1072, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1237,
      1249, 1252, 1255, 1258, 1261, 1264,
    ].includes(code)
  ) {
    return CloudSnow;
  }

  return dayTime ? CloudSun : CloudMoon;
};

const getBgColor = (weather: WeatherData | null) => {
  if (!weather) return "bg-black";
  const code = weather.current.condition.code;
  const isDay = weather.current.is_day;

  if (code == 1000 && isDay === 1) return "bg-[#2CAEFF]";
  if (code == 1000 && isDay === 0) return "bg-[#1A2C42]";
  return "bg-[#CCCCCC] text-gray-800";
};

// Necessário para `output: "export"` em rotas dinâmicas
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
    // Em export estático, não dá pra usar alert aqui; você pode retornar uma UI de erro se quiser.
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
