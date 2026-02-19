import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTadarus } from "../hooks/useTadarus";
import AddTadarusModal from "../components/AddTadarusModal";
import { getItemCountsByTadarus } from "../api/tadarusApi";

export default function Home() {
  const navigate = useNavigate();
  const { dataTadarus, loading, refetch } = useTadarus();
  const [openModal, setOpenModal] = useState(false);
  const [itemCounts, setItemCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    getItemCountsByTadarus().then(setItemCounts);
  }, []);

  return (
    <div className="max-w-xl mx-auto flex-col bg-gray-50 p-8 text-center min-h-screen">
      <p className="text-4xl font-bold text-gray-700 mb-2">Yuk Tadarus</p>
      <p className="text-xl font-semibold text-gray-500">
        Ajak teman, buat kelompok, dan saling jaga semangat sampai khatam.
      </p>

      <button
        onClick={() => setOpenModal(true)}
        className="font-semibold text-white bg-sky-500 border-sky-500 border-2 rounded-2xl shadow-[0_2px_0_0_rgba(0,0,0,0.3)] px-4 py-2 active:translate-y-[6px] active:shadow-none transition-all duration-150 hover:-translate-y-1 hover:shadow-[0_8px_0_0_rgba(0,0,0,0.5)] mt-6"
      >
        + Buat Kelompok
      </button>

      <div className="mt-8">
        {loading ? (
          <p className="text-gray-400 font-semibold animate-pulse">Memuat...</p>
        ) : dataTadarus.length === 0 ? (
          <p className="text-gray-400 font-semibold mt-12">
            Belum ada kelompok. Yuk buat yang pertama!
          </p>
        ) : (
          dataTadarus.map((tadarus) => (
            <div
              key={tadarus.id}
              onClick={() => navigate(`/tadarus/${tadarus.id}`)}
              className="cursor-pointer font-semibold text-gray-500 border-gray-300 border-2 rounded-2xl bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.1)] p-4 transition-all duration-150 mt-4 hover:bg-gray-100 hover:-translate-y-1 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.1)] text-left flex items-center justify-between"
            >
              <div>
                <p className="text-lg font-bold capitalize text-gray-700">
                  {tadarus.name}
                </p>
                <p className="text-sm font-semibold text-gray-500">
                  {tadarus.description}
                </p>
              </div>
              <span className="ml-4 shrink-0 bg-sky-100 text-sky-600 font-bold text-sm rounded-full px-3 py-1">
                {itemCounts[tadarus.id] ?? 0} setoran
              </span>
            </div>
          ))
        )}
      </div>

      <AddTadarusModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={refetch}
      />
    </div>
  );
}
