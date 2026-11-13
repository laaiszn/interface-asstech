import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/Rotas/ProtectedRoutes";
import PHome from "./pages/PHome/PHome";
import PLogin from "./pages/PLogin/PLogin";
import PClientes from "./pages/PClientes/PClientes";
import PEquipamentos from "./pages/PEquipamentos/PEquipamentos";
import PAgendamentos from "./pages/PAgendamentos/PAgendamentos";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PHome />} />
        <Route path="/login" element={<PLogin />} />
        <Route path="/clientes" element={<ProtectedRoute><PClientes /></ProtectedRoute>} />
        <Route path="/equipamentos" element={<ProtectedRoute><PEquipamentos /></ProtectedRoute>} />
        <Route path="/agendamentos" element={<ProtectedRoute><PAgendamentos /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;