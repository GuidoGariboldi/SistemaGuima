import { Routes, Route } from "react-router-dom";
import { Toaster } from "sileo";
import Home from "./pages/home";
import Info from "./pages/info";
import Admin from "./pages/admin";
import Caja from "./pages/caja";
import Carga from "./pages/carga";
import CargaResultado from "./pages/carga-resultado";
import Escanear from "./pages/escanear";
import Control from "./pages/control";
import AuthGoogleCallback from "./pages/auth-google-callback";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        theme="dark"
        offset={{ top: 80, right: 16 }}
        options={{
          fill: "#171717",
          styles: {
            title: "text-white!",
            description: "text-white/75!",
            badge: "bg-white/10!",
            button: "bg-white/10!",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/info" element={<Info />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/caja" element={<Caja />} />
        <Route path="/carga" element={<Carga />} />
        <Route path="/carga/resultado" element={<CargaResultado />} />
        <Route path="/escaneartarjeta" element={<Escanear />} />
        <Route path="/control" element={<Control />} />
        <Route path="/auth/google/callback" element={<AuthGoogleCallback />} />
      </Routes>
    </>
  );
}

export default App;