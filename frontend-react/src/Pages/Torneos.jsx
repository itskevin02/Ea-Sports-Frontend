import { useState } from 'react';
import { torneosData } from '../datos/torneos';
import { TarjetaTorneo } from '../Components/TarjetaTorneo';

export const Torneos = () => {
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('Todos');

  const torneosFiltrados = torneosData.filter((torneo) => {
    const coincideTexto = 
      torneo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      torneo.juego.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideEstado = 
      estadoFiltro === 'Todos' || torneo.estado === estadoFiltro;

    return coincideTexto && coincideEstado;
  });

  return (
    <div>
      <h2 className="h4 mb-4 border-bottom pb-2">Torneos Disponibles</h2>

      <div className="row mb-4 g-3">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o juego..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="Todos">Todos los estados</option>
            <option value="Abierto">Abiertos</option>
            <option value="Cerrado">Cerrados</option>
          </select>
        </div>
      </div>

      <div className="row">
        {torneosFiltrados.length > 0 ? (
          torneosFiltrados.map((torneo) => (
            <TarjetaTorneo key={torneo.id} torneo={torneo} />
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted lead">No se encontraron torneos con esos criterios.</p>
          </div>
        )}
      </div>
    </div>
  );
};