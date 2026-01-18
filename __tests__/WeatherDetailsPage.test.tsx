import React from 'react';
import { render, screen } from '@testing-library/react';
import { WeatherDetailsPage } from '../app/components/WeatherDetailsPage';

const baseWeather = {
  location: { name: 'Brasília', country: 'Brazil' },
  current: {
    temp_c: 30,
    condition: { text: 'Sunny', code: 1000, icon: '' },
    wind_kph: 10,
    humidity: 40,
    is_day: 1,
  },
  forecast: {
    forecastday: [
      {
        date: '2025-01-01',
        astro: {
          sunrise: '06:00 AM',
          sunset: '06:00 PM',
        },
        day: {
          maxtemp_c: 28,
          mintemp_c: 18,
        },
        hour: Array.from({ length: 24 }).map((_, hour) => ({
          time_epoch: hour,
          time: `2025-01-01 ${hour.toString().padStart(2, '0')}:00`,
          temp_c: 20 + hour,
          condition: { icon: '', text: 'Sunny', code: 1000 },
          is_day: hour >= 6 && hour <= 18 ? 1 : 0,
        })),
      },
    ],
  },
} as any;

// Jest globals (describe/it/expect) are available via @types/jest

describe('WeatherDetailsPage', () => {
  it('renders city name and condition', () => {
    render(
      <WeatherDetailsPage
        selectedCity="Brasília"
        weather={baseWeather}
      />
    );

    expect(screen.getByText('Brasília')).toBeInTheDocument();
    expect(screen.getByText(/Sunny/i)).toBeInTheDocument();
  });

  it('ensures displayed max is at least current temp and min is at most current temp', () => {
    render(
      <WeatherDetailsPage
        selectedCity="Brasília"
        weather={baseWeather}
      />
    );

    expect(screen.getByText(/↑ 30°/)).toBeInTheDocument();
    expect(screen.getByText(/↓ 18°/)).toBeInTheDocument();
  });
});
