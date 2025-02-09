import { Outlet } from "react-router-dom";
import Header from "../_components/Header/Header";
import Footer from "../_components/Footer/Footer";

export default function ClientLayout() {
  return (
    <>
      <Header />
      <main className="my-8">
        <Outlet />
      </main>
      <Footer/>
    </>
  );
}
