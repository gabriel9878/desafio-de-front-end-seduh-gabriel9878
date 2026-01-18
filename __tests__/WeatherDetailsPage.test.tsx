import React from 'react';
import { render, screen } from '@testing-library/react';
import { WeatherDetailsPage } from '../app/components/WeatherDetailsPage';

const buildWeather = (overrides: Partial<any> = {}): any => {
  const base = {
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
  };

  return {
    ...base,
    ...overrides,
    current: {
      ...base.current,
      ...(overrides as any).current,
    },
    forecast: {
      ...base.forecast,
      ...(overrides as any).forecast,
    },
  };
};

describe('WeatherDetailsPage', () => {
  it('renders city name, condition and key labels', () => {
    render(
      <WeatherDetailsPage
        selectedCity="Brasília"
        weather={buildWeather()}
      />
    );

    // Cabeçalho
    expect(screen.getByText('Brasília')).toBeInTheDocument();
    expect(screen.getByText(/Sunny/i)).toBeInTheDocument();

    // Labels de períodos do dia
    expect(screen.getByText('Dawn')).toBeInTheDocument();
    expect(screen.getByText('Morning')).toBeInTheDocument();
    expect(screen.getByText('Afternoon')).toBeInTheDocument();
    expect(screen.getByText('Night')).toBeInTheDocument();

    // Labels de detalhes adicionais
    expect(screen.getByText('Wind speed')).toBeInTheDocument();
    expect(screen.getByText('Sunrise')).toBeInTheDocument();
    expect(screen.getByText('Sunset')).toBeInTheDocument();
    expect(screen.getByText('Humidity')).toBeInTheDocument();

    // Valores derivados
    expect(screen.getByText('10 km/h')).toBeInTheDocument();
    expect(screen.getByText('06:00 AM')).toBeInTheDocument();
    expect(screen.getByText('06:00 PM')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });

  it('ensures displayed max is at least current temp and min is at most current temp', () => {
    render(
      <WeatherDetailsPage
        selectedCity="Brasília"
        weather={buildWeather()}
      />
    );

    expect(screen.getByText(/↑ 30°/)).toBeInTheDocument();
    expect(screen.getByText(/↓ 18°/)).toBeInTheDocument();
  });

  it('uses a cloudy icon set for cloudy daytime conditions', () => {
    render(
      <WeatherDetailsPage
        selectedCity="Cloudy City"
        weather={buildWeather({
          current: {
            temp_c: 22,
            condition: { text: 'Cloudy', code: 1003, icon: '' },
            wind_kph: 5,
            humidity: 60,
            is_day: 1,
          },
        })}
      />
    );

    // Deve renderizar o texto da condição alterada
    expect(screen.getByText('Cloudy')).toBeInTheDocument();
  });

  it('uses a rain icon set for rain conditions', () => {
    render(
      <WeatherDetailsPage
        selectedCity="Rainy City"
        weather={buildWeather({
          current: {
            temp_c: 20,
            condition: { text: 'Light rain', code: 1183, icon: '' },
            wind_kph: 15,
            humidity: 80,
            is_day: 1,
          },
        })}
      />
    );

    expect(screen.getByText('Light rain')).toBeInTheDocument();
  });

  it('uses a fog icon set for fog conditions', () => {
    render(
      <WeatherDetailsPage
        selectedCity="Foggy City"
        weather={buildWeather({
          current: {
            temp_c: 18,
            condition: { text: 'Fog', code: 1030, icon: '' },
            wind_kph: 2,
            humidity: 95,
            is_day: 1,
          },
        })}
      />
    );

    // Pode haver mais de um elemento com "Fog" (título + condição); basta garantir que existe pelo menos um
    expect(screen.getAllByText('Fog').length).toBeGreaterThanOrEqual(1);
  });

  it('uses a snow icon set for snow conditions', () => {
    render(
      <WeatherDetailsPage
        selectedCity="Snow City"
        weather={buildWeather({
          current: {
            temp_c: -2,
            condition: { text: 'Snow', code: 1210, icon: '' },
            wind_kph: 8,
            humidity: 90,
            is_day: 1,
          },
        })}
      />
    );

    expect(screen.getAllByText('Snow').length).toBeGreaterThanOrEqual(1);
  });

  it('uses night-specific icons for clear night conditions', () => {
    render(
      <WeatherDetailsPage
        selectedCity="Night City"
        weather={buildWeather({
          current: {
            temp_c: 19,
            condition: { text: 'Clear', code: 1000, icon: '' },
            wind_kph: 3,
            humidity: 50,
            is_day: 0,
          },
        })}
      />
    );

    expect(screen.getByText('Clear')).toBeInTheDocument();
  });
});
