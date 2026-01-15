"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  Wind,
  Sun,
  Sunrise,
  Sunset,
  Droplets,
  ArrowLeft,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudDrizzle,
  CloudFog,
  MoonStar,
} from "lucide-react";

// --- CONFIGURAÇÃO ---
const API_KEY = "07e29eaa30e74ae6b3f10722261501";

// Lista de Cidades Solicitada
const CITIES = [
  { label: "Dallol", query: "Dallol, Ethiopia" },
  { label: "Fairbanks", query: "Fairbanks, United States" },
  { label: "Londres", query: "London, United Kingdom" },
  { label: "Recife", query: "Recife, Brazil" },
  { label: "Vancouver", query: "Vancouver, Canada" },
  { label: "Yakutsk", query: "Yakutsk, Russia" },
];

// Tipagem básica do retorno da API (simplificada)
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

export default function WeatherApp() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  // Função para buscar dados
  const fetchWeather = async (query: string) => {
    setLoading(true);
    try {
      // Usamos forecast.json para pegar máximas, mínimas e horas
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=1&aqi=no&alerts=no`
      );
      if (!res.ok) throw new Error("Falha ao buscar");
      const data = await res.json();
      setWeather(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar dados. Verifique a chave da API.");
      setSelectedCity(null);
    } finally {
      setLoading(false);
    }
  };

  // Efeito ao selecionar cidade
  useEffect(() => {
    if (selectedCity) {
      const cityQuery = CITIES.find((c) => c.label === selectedCity)?.query;
      if (cityQuery) fetchWeather(cityQuery);
    } else {
      setWeather(null);
    }
  }, [selectedCity]);

  // Função para definir cor de fundo baseada no clima (foto1 vs foto2)
  const getBgColor = () => {
    if (!weather) return "bg-black";
    const code = weather.current.condition.code;
    const isDay = weather.current.is_day;
    
    // Códigos simples: 1000 = Sol/Limpo. 
    // Se for neve (códigos > 1114 aprox) ou nublado, usamos cinza.
    // Se for dia e limpo, azul.
    //2caeff
    // Exemplo simplificado (pode expandir a lógica):
    if (code === 1000 && isDay) return "bg-[#2CAEFF]"; // Azul da Foto 2
    if (code === 1000 && !isDay) return "bg-[#1A2C42]"; // Azul Noite
    return "bg-[#CCCCCC] text-gray-800"; // Cinza da Foto 1 (Neve/Nublado)
  };

  const getLucideIconForCondition = (code: number, isDay: number) => {
    const dayTime = isDay === 1;

    // Códigos WeatherAPI (agrupados de forma simplificada)
    // 1000: Clear
    // 1003,1006,1009: Cloudy/Overcast
    // 1030,1135,1147: Mist/Fog
    // 1063,1150-1207,1240-1246: Rain/Drizzle
    // 1066,1069,1072,1114,1117,1210-1237,1249-1264: Snow/Ice
    // 1087,1273-1282: Thunder (tratado como chuva aqui)

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

    // fallback genérico
    return dayTime ? CloudSun : CloudMoon;
  };

  // --- RENDERIZAÇÃO: TELA DE SELEÇÃO (FOTO TELA 3) ---
  if (!selectedCity) {
    return (
  <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Weather</h1>
          <p className="text-gray-400 text-sm">Select a city</p>
        </header>

        <div className="mb-12">
           {/* Ícone de Globo Estilizado */}
           <Globe size={80} strokeWidth={1} className="text-white" />
        </div>

        <div className="grid grid-cols-3 gap-x-8 gap-y-12 max-w-md w-full text-center">
          {CITIES.map((city) => (
            <button
              key={city.label}
              onClick={() => setSelectedCity(city.label)}
              className="text-sm font-bold hover:text-blue-400 transition-colors uppercase tracking-wider"
            >
              {city.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- RENDERIZAÇÃO: TELA DE CARREGAMENTO ---
  if (loading || !weather) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="animate-pulse">Loading weather data...</p>
      </div>
    );
  }

  // Helpers para renderização dos detalhes
  const current = weather.current;
  const today = weather.forecast.forecastday[0];
  const textColor = getBgColor().includes("bg-[#CCCCCC]") ? "text-gray-800" : "text-white";
  
  // Mapeando horas específicas para "Dawn, Morning, Afternoon, Night"
  // WeatherAPI retorna array 'hour' de 0 a 23.
  const timePoints = [
    { label: "Dawn", index: 6 },      // 06:00
    { label: "Morning", index: 10 },  // 10:00
    { label: "Afternoon", index: 15 },// 15:00
    { label: "Night", index: 21 },    // 21:00
  ];

  // --- RENDERIZAÇÃO: TELA DE DETALHES (FOTO 1 e 2) ---
  return (
    <div className={`min-h-screen ${getBgColor()} ${textColor} flex flex-col items-center p-6 transition-colors duration-500`}>
      
      {/* Botão Voltar */}
      <div className="w-full max-w-md flex justify-start mb-4">
        <button onClick={() => setSelectedCity(null)} className="flex items-center text-sm opacity-70 hover:opacity-100">
          <ArrowLeft size={20} className="mr-2" /> Back
        </button>
      </div>

      {/* Cabeçalho da Cidade */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-light mb-1">{selectedCity}</h1>
        <p className="text-lg opacity-80">{current.condition.text}</p>
      </div>

      {/* Temperatura Principal */}
      <div className="text-center mb-8 relative">
        <div className="text-[8rem] leading-none font-thin tracking-tighter">
          {Math.round(current.temp_c)}
          <span className="text-4xl align-top absolute mt-4">°C</span>
        </div>
        <div className="flex flex-col absolute right-[-40px] top-[40%] text-sm opacity-80">
          <span>↑ {Math.round(today.day.maxtemp_c)}°</span>
          <span>↓ {Math.round(today.day.mintemp_c)}°</span>
        </div>
      </div>

      {/* Ícone Principal Grande */}
      <div className="mb-12">
        {(() => {
          const Icon = getLucideIconForCondition(
            current.condition.code,
            current.is_day
          );
          return <Icon size={140} />;
        })()}
      </div>

    {/* Previsão por Período (Dawn, Morning, etc) */}
    <div className="w-full max-w-md grid grid-cols-4 gap-4 text-center  border-opacity-20 border-white pb-4">
        {timePoints.map((point) => {
           const hourData = today.hour[point.index];
           const Icon = getLucideIconForCondition(
             hourData.condition.code,
             hourData.is_day
           );

           return (
             <div key={point.label} className="flex flex-col items-center">
               <span className="text-xs opacity-70 mb-2">{point.label}</span>
               <Icon size={28} className="mb-1" />
               <span className="text-sm font-medium">{Math.round(hourData.temp_c)}°C</span>
             </div>
           );
        })}
      </div>

      {/* Grid de Detalhes Inferior */}
      <div className="w-full max-w-md flex items-stretch justify-between text-center text-xs opacity-90 mt-3">
        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="opacity-70">Wind speed</span>
          
          <span>{current.wind_kph} km/h</span>
        </div>

        <div className="h-8 w-px bg-white/40 self-center" />

        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="opacity-70">Sunrise</span>
          
          <span>{today.astro.sunrise}</span>
        </div>

        <div className="h-8 w-px bg-white/40 self-center" />

        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="opacity-70">Sunset</span>
          
          <span>{today.astro.sunset}</span>
        </div>

        <div className="h-8 w-px bg-white/40 self-center" />

        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="opacity-70">Humidity</span>
          
          <span>{current.humidity}%</span>
        </div>
      </div>
    </div>
  );
}