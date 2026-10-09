import React from 'react';

export const TarjetaTorneo = ({ torneo }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm border-0">
        <img 
          src={torneo.imagen} 
          className="card-img-top" 
          alt={torneo.nombre} 
        />
        <div className="card-body d-flex flex-column">
          <span className={`badge ${torneo.estado === 'Abierto' ? 'bg-success' : 'bg-secondary'} w-auto ms-auto mb-2`}>
            {torneo.estado}
          </span>
          <h5 className="card-title fw-bold">{torneo.nombre}</h5>
          <p className="card-text text-muted mb-1">
            <i className="bi bi-controller me-2"></i>{torneo.juego}
          </p>
          <p className="card-text text-muted mb-2">
            <i className="bi bi-laptop me-2"></i>{torneo.plataforma}
          </p>
          <p className="card-text small text-secondary flex-grow-1">
            {torneo.descripcion}
          </p>
          <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
            <small className="text-muted">
              Cupos: {torneo.inscritos}/{torneo.cupos}
            </small>
            <button className="btn btn-outline-primary btn-sm">
              Ver Detalle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};