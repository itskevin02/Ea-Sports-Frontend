import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './Components/Navbar';
import { Inicio } from './pages/inicio';
import { Torneos } from './pages/Torneos';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/torneos" element={<Torneos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;