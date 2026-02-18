import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home.tsx";
import TadarusDetail from "../pages/TadarusDetail.tsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tadarus/:id" element={<TadarusDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
