import { Outlet } from "react-router-dom";
import Header from "../_components/Header/Header";
import Footer from "../_components/Footer/Footer";
import { useEffect, useState } from "react";

export default function ClientLayout() {
  const [isSticky, setIsSticky] = useState(false);
    useEffect(() => {
      const handleScroll = () => {
        setIsSticky(window.scrollY > 100); 
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  return (
    <div className="font-client">
      <Header />
      <main className={`mb-8 transition-transform min-h-[100vh] duration-300 ${isSticky ? '': 'mt-8'}`}>
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}
