import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './Components/Navbar';
import { Inicio } from './Pages/Inicio';
import { Torneos } from './Pages/Torneos';

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
<Route path="/torneos/:id" element={<DetalleTorneo />} />
export default App;