import React from 'react';
import { render, screen } from '@testing-library/react';
import { CitySelectionPage } from '../app/components/CitySelectionPage';

// Local test data: keep it structurally compatible without using the narrow CityConfig union type
const cities = [
  { slug: 'brasilia', label: 'Brasília', query: 'Brasilia,BR' },
  { slug: 'sao-paulo', label: 'São Paulo', query: 'Sao Paulo,BR' },
  { slug: 'rio-de-janeiro', label: 'Rio de Janeiro', query: 'Rio de Janeiro,BR' },
];

describe('CitySelectionPage', () => {
  it('renders all city labels', () => {
    // Cast only at the call site to satisfy the prop type
    render(<CitySelectionPage cities={cities as any} />);

    cities.forEach((city) => {
      expect(screen.getByText(city.label)).toBeInTheDocument();
    });
  });
});
