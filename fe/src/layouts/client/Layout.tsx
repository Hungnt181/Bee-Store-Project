import { Outlet } from "react-router-dom";
import Header from "../_components/Header/Header";
import Footer from "../_components/Footer/Footer";

export default function ClientLayout() {
  return (
    <div className="font-client bg-[#f9f9fb] text-gray-800">
      <Header />
      <main className=" transition-transform min-h-[70vh] duration-300  ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
// import { Outlet } from "react-router-dom";
// import Header from "../_components/Header/Header";
// import Footer from "../_components/Footer/Footer";

// export default function ClientLayout() {
//   return (
//     <div className="font-client bg-[#f9f9fb] text-gray-800">
//       <Header />
//       <main className="min-h-[70vh] transition-all duration-300 px-4 lg:px-8 py-8">
//         <div className="max-w-[1240px] mx-auto">
//           <Outlet />
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }
