import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { TadarusDTO } from "../dto/tadarusDto";
import type { TadarusUserDto } from "../dto/tadarusUserDto";
import type { TadarusItemDto } from "../dto/tadarusItemDto";
import AddUserModal from "../components/AddUserModal";
import AddLogItem from "../components/AddLogItem";
import SummaryModal from "../components/SummaryModal";
import {
  getTadarusById,
  getTadarusItems,
  getTadarusUsersByTadarus,
} from "../api/tadarusApi";

export default function TadarusDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tadarus, setTadarus] = useState<TadarusDTO | null>(null);
  const [tadarusUsers, setTadarusUsers] = useState<TadarusUserDto[]>([]);
  const [tadarusItems, setTadarusItems] = useState<TadarusItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openLogModal, setOpenLogModal] = useState(false);
  const [openSummaryModal, setOpenSummaryModal] = useState(false);

  async function fetchMembers() {
    if (!id) return;
    const data = await getTadarusUsersByTadarus(Number(id));
    setTadarusUsers(data);
  }

  async function fetchItems() {
    if (!id) return;
    const data = await getTadarusItems(Number(id));
    setTadarusItems(data);
  }

  useEffect(() => {
    if (!id) return;
    async function fetchAll() {
      setLoading(true);
      try {
        // Fetch tadarus detail
        const data = await getTadarusById(Number(id));
        setTadarus(data);

        // Fetch members and items in parallel
        const [membersData, itemsData] = await Promise.all([
          getTadarusUsersByTadarus(Number(id)),
          getTadarusItems(Number(id)),
        ]);
        setTadarusUsers(membersData);
        setTadarusItems(itemsData);
      } catch (err) {
        console.error("Failed to fetch tadarus detail:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [id]);

  const getMemberName = (userId: number) =>
    tadarusUsers.find((m) => m.id === userId)?.name ?? "Unknown";

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-400 font-semibold animate-pulse">Memuat...</p>
      </div>
    );
  }

  if (!tadarus) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-400 font-semibold">Tadarus tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-8 py-8 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="text-gray-500 hover:text-gray-700 font-semibold text-sm mb-6 flex items-center gap-1 transition-colors duration-150"
      >
        ← Kembali
      </button>
      {/* Title */}
      <p className="text-4xl font-bold text-gray-700 mb-2 capitalize">
        {tadarus.name}
      </p>
      {/* Description */}
      <p className="text-xl font-semibold text-gray-500 mb-6">
        {tadarus.description}
      </p>
      {/* User Chips */}
      <div className="flex flex-wrap gap-3 justify-center mt-6">
        {tadarusUsers.map((member) => (
          <span
            key={member.id}
            className="rounded-full px-4 py-2 bg-gray-200 font-semibold text-gray-700 shadow-[0_2px_0_0_rgba(0,0,0,0.1)] text-sm"
          >
            {member.name}
          </span>
        ))}

        {/* Add Member Button */}
        <button
          onClick={() => {
            setOpenModal(true);
          }}
          className="rounded-full px-4 py-2 bg-sky-500 text-white font-semibold text-sm shadow-[0_2px_0_0_rgba(0,0,0,0.3)] active:translate-y-[4px] active:shadow-none hover:-translate-y-1 hover:shadow-[0_8px_0_0_rgba(0,0,0,0.3)] transition-all duration-150"
        >
          + Tambah User
        </button>
      </div>
      {/* Progress Section */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-lg font-bold text-gray-700">Log Setoran</p>
          <div className="flex gap-2">
            <button
              onClick={() => setOpenSummaryModal(true)}
              className="font-semibold text-white bg-sky-500 border-sky-500 border-2 rounded-2xl shadow-[0_2px_0_0_rgba(0,0,0,0.3)] px-4 py-2 text-sm active:translate-y-[6px] active:shadow-none transition-all duration-150 hover:-translate-y-1 hover:shadow-[0_8px_0_0_rgba(0,0,0,0.5)]"
            >
              Lapor Grup
            </button>
            <button
              onClick={() => {
                setOpenLogModal(true);
              }}
              className="font-semibold text-white bg-sky-500 border-sky-500 border-2 rounded-2xl shadow-[0_2px_0_0_rgba(0,0,0,0.3)] px-4 py-2 text-sm active:translate-y-[6px] active:shadow-none transition-all duration-150 hover:-translate-y-1 hover:shadow-[0_8px_0_0_rgba(0,0,0,0.5)]"
            >
              + Tambah Setoran
            </button>
          </div>
        </div>

        {/* Item Cards */}
        {tadarusItems.length === 0 ? (
          <div className="text-center py-16 text-gray-400 font-semibold">
            Belum ada setoran. Yuk mulai!
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {tadarusItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border-gray-300 border-2 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.1)] p-4 hover:bg-gray-100 transition-all duration-150"
              >
                <div className="flex justify-between items-start">
                  {/* Left */}
                  <div className="flex flex-col gap-2">
                    {/* Member badge */}
                    <span className="bg-red-300 rounded-full px-3 py-1 text-sm font-semibold text-white w-fit">
                      {getMemberName(item.tadarus_user)}
                    </span>

                    {/* Surah range */}
                    <p className="font-bold text-gray-700 text-sm">
                      {item.from_surah} {item.from_ayah} → {item.to_surah}{" "}
                      {item.to_ayah}
                    </p>

                    {/* Note */}
                    {item.note ? (
                      <p className="text-sm text-gray-500 italic">
                        📝 {item.note}
                      </p>
                    ) : null}
                  </div>

                  {/* Right: Date */}
                  <p className="text-sm text-gray-400 whitespace-nowrap ml-4">
                    {formatDate((item as any).created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <AddUserModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        tadarusId={id!}
        onSuccess={fetchMembers}
      />
      <AddLogItem
        isOpen={openLogModal}
        onClose={() => setOpenLogModal(false)}
        tadarusId={id!}
        members={tadarusUsers}
        onSuccess={() => {
          fetchItems();
          setOpenSummaryModal(true);
        }}
      />
      {tadarus && (
        <SummaryModal
          isOpen={openSummaryModal}
          onClose={() => setOpenSummaryModal(false)}
          tadarus={tadarus}
          members={tadarusUsers}
          items={tadarusItems}
        />
      )}
    </div>
  );
}
