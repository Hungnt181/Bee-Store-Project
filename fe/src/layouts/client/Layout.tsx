import { Outlet } from "react-router-dom";
import Header from "../_components/Header/Header";
import Footer from "../_components/Footer/Footer";

export default function ClientLayout() {
  return (
    <div className="font-client">
      <Header />
      <main className={`mb-8 transition-transform min-h-[100vh] duration-300 `}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
