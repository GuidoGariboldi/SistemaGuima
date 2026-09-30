import { Routes, Route } from "react-router-dom";
import { Toaster } from "sileo";
import Home from "./pages/home";
import Info from "./pages/info";
import Admin from "./pages/admin";
import Caja from "./pages/caja";
import Carga from "./pages/carga";
import Escanear from "./pages/escanear";
import LoginAdmin from "./pages/loginAdmin";
import LoginCaja from "./pages/loginCaja";

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
        <Route path="/escaneartarjeta" element={<Escanear />} />
        <Route path="/loginadmin" element={<LoginAdmin />} />
        <Route path="/logincaja" element={<LoginCaja />} />
      </Routes>
    </>
  );
}

export default App;