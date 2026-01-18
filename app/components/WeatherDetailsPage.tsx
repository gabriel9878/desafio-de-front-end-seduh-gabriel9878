"use client";

import React from "react";
import { ArrowLeft, CloudSun, CloudMoon, CloudRain, CloudSnow, CloudFog, Sun, MoonStar } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

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

interface WeatherDetailsPageProps {
  selectedCity: string;
  weather: WeatherData;
  setSelectedCity?: Dispatch<SetStateAction<string | null>>;
}

const getBgColor = (weather: WeatherData) => {
  const code = weather.current.condition.code;
  const isDay = weather.current.is_day;

  if (code === 1000 && isDay === 1) return "bg-[#2CAEFF]";
  if (code === 1000 && isDay === 0) return "bg-[#1A2C42]";
  return "bg-[#CCCCCC] text-gray-800";
};

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

export function WeatherDetailsPage({
  selectedCity,
  weather,
  setSelectedCity,
}: WeatherDetailsPageProps) {
  const current = weather.current;
  const today = weather.forecast.forecastday[0];

  const bgColor = getBgColor(weather);
  const textColor = bgColor.includes("bg-[#CCCCCC]") ? "text-gray-800" : "text-white";

  const timePoints = [
    { label: "Dawn", index: 3 },
    { label: "Morning", index: 9 },
    { label: "Afternoon", index: 15 },
    { label: "Night", index: 21 },
  ];

  const displayMax = Math.max(current.temp_c, today.day.maxtemp_c);
  const displayMin = Math.min(current.temp_c, today.day.mintemp_c);

  // Elemento do ícone principal da condição atual, criado uma vez por render
  const conditionIconElement = React.createElement(
    getLucideIconForCondition(current.condition.code, current.is_day),
    {
      size: 90,
      className: "sm:h-[120px] sm:w-[120px] md:h-[140px] md:w-[140px]",
    }
  );

  return (
    <main
      className={`min-h-screen ${bgColor} ${textColor} flex flex-col items-center justify-center p-6 transition-colors duration-500`}
    >
      {setSelectedCity && (
        <nav className="w-full max-w-md flex justify-start mb-4" aria-label="Navegação">
          <button
            type="button"
            onClick={() => setSelectedCity(null)}
            className="flex items-center text-sm opacity-70 hover:opacity-100"
          >
            <ArrowLeft size={20} className="mr-2" /> Back
          </button>
        </nav>
      )}

      <header className="text-center mb-8">
        <h1 className="text-4xl font-light mb-1">{selectedCity}</h1>
        <p className="text-lg opacity-80">{current.condition.text}</p>
      </header>

      <section
        className="relative flex justify-center mb-8"
        aria-label="Temperatura atual e máximas e mínimas do dia"
      >
        <div className="flex items-start">
          <span className="text-[6rem] leading-none font-thin tracking-tighter">
            {Math.round(current.temp_c)}
          </span>
          <span className="text-4xl pt-2 pl-4">
            °<span className="ml-1">C</span>
          </span>
        </div>
        <div className="flex flex-col absolute right-[-0px] top-[64%] text-xs opacity-80">
          <span>↑ {Math.round(displayMax)}°</span>
          <span>↓ {Math.round(displayMin)}°</span>
        </div>
      </section>

      <section className="mb-10 sm:mb-12" aria-label="Condição climática atual">
        {conditionIconElement}
      </section>

      <section
        className="w-full max-w-md grid grid-cols-3 gap-4 text-center border-opacity-20 border-white pb-4 sm:grid-cols-4"
        aria-label="Previsão por períodos do dia"
      >
        {timePoints.map((point, index) => {
          const hourData = today.hour[point.index];
          const HourIcon = getLucideIconForCondition(hourData.condition.code, hourData.is_day);

          return (
            <article
              key={point.label}
              className={`flex flex-col items-center ${
                index === 3 ? "col-span-3 sm:col-span-1" : ""
              }`}
            >
              <span className="text-xs opacity-70 mb-2">{point.label}</span>
              <HourIcon size={28} className="mb-1" />
              <span className="text-sm font-medium">{Math.round(hourData.temp_c)}°C</span>
            </article>
          );
        })}
      </section>

      <section
        className="w-full max-w-md grid grid-cols-2 gap-x-8 gap-y-4 text-center text-xs opacity-90 mt-3 sm:flex sm:items-stretch sm:justify-between sm:gap-0"
        aria-label="Detalhes adicionais do clima"
      >
        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="opacity-70">Wind speed</span>
          <span>{current.wind_kph} km/h</span>
        </div>

        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="opacity-70">Sunrise</span>
          <span>{today.astro.sunrise}</span>
        </div>

        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="opacity-70">Sunset</span>
          <span>{today.astro.sunset}</span>
        </div>

        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="opacity-70">Humidity</span>
          <span>{current.humidity}%</span>
        </div>
      </section>
    </main>
  );
}
