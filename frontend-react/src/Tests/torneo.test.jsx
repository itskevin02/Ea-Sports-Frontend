// @vitest-environment jsdom
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { TarjetaTorneo } from '../Components/TarjetaTorneo';
import { Navbar } from '../Components/Navbar';

expect.extend(matchers);

const torneoMock = {
  id: 1,
  nombre: "Copa EA Sports FC 24",
  juego: "EA Sports FC",
  estado: "Abierto"
};

describe('Pruebas unitarias del módulo de Torneos', () => {

  // Prueba 1: Verifica que el Navbar se renderice
  test('1. Renderiza el menú de navegación (Navbar)', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    // Búsqueda flexible del texto principal del Navbar
    expect(screen.getAllByText(/EA Sports/i)[0]).toBeInTheDocument();
  });

  // Prueba 2: Verifica que la tarjeta muestre el nombre del torneo
  test('2. Renderiza el título del torneo en la TarjetaTorneo', () => {
    render(
      <BrowserRouter>
        <TarjetaTorneo torneo={torneoMock} />
      </BrowserRouter>
    );
    expect(screen.getAllByText(/Copa EA Sports FC 24/i)[0]).toBeInTheDocument();
  });

  // Prueba 3: Verifica que la tarjeta muestre el estado del torneo
  test('3. Renderiza el estado del torneo en la tarjeta', () => {
    render(
      <BrowserRouter>
        <TarjetaTorneo torneo={torneoMock} />
      </BrowserRouter>
    );
    expect(screen.getAllByText(/Abierto/i)[0]).toBeInTheDocument();
  });

});
