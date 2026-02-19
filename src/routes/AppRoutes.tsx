import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home.tsx";
import TadarusDetail from "../pages/TadarusDetail.tsx";
import Footer from "../components/Footer";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tadarus/:id" element={<TadarusDetail />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
