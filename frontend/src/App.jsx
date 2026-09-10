import { Routes, Route } from "react-router-dom";
import TeosHome from "./pages/home";
import TeosAdmin from "./pages/admin";
import TeosCaja from "./pages/caja";
import TeosCarga from "./pages/carga";
import TeosEscanear from "./pages/escanear";
import TeosLoginAdmin from "./pages/loginAdmin";
import TeosLoginCaja from "./pages/loginCaja";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TeosHome />} />
      <Route path="/admin" element={<TeosAdmin />} />
      <Route path="/caja" element={<TeosCaja />} />
      <Route path="/carga" element={<TeosCarga />} />
      <Route path="/escaneartarjeta" element={<TeosEscanear />} />
      <Route path="/loginadmin" element={<TeosLoginAdmin />} />
      <Route path="/logincaja" element={<TeosLoginCaja />} />
    </Routes>
  );
}

export default App;