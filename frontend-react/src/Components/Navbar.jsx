import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-controller me-2"></i>EA Sports
        </Link>
        <div className="collapse navbar-collapse d-flex justify-content-end">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/torneos">Torneos</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}