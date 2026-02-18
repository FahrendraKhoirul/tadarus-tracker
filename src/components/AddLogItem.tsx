import { useState } from "react";
import Modal from "./Modal";
import { createTadarusItem } from "../api/tadarusApi";
import type { TadarusUserDto } from "../dto/tadarusUserDto";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tadarusId: string;
  members: TadarusUserDto[];
  onSuccess: () => void;
}

export default function AddLogItem({
  isOpen,
  onClose,
  tadarusId,
  members,
  onSuccess,
}: Props) {
  const [tadarusUser, setTadarusUser] = useState("");
  const [fromSurah, setFromSurah] = useState("");
  const [fromAyah, setFromAyah] = useState("");
  const [toSurah, setToSurah] = useState("");
  const [toAyah, setToAyah] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  function reset() {
    setTadarusUser("");
    setFromSurah("");
    setFromAyah("");
    setToSurah("");
    setToAyah("");
    setNote("");
  }

  async function handleSubmit() {
    if (!tadarusUser || !fromSurah || !fromAyah || !toSurah || !toAyah) return;

    setLoading(true);
    try {
      await createTadarusItem({
        tadarus_id: Number(tadarusId),
        tadarus_user: Number(tadarusUser),
        from_surah: fromSurah,
        from_ayah: Number(fromAyah),
        to_surah: toSurah,
        to_ayah: Number(toAyah),
        note,
      });
      reset();
      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "border-2 border-gray-300 w-full px-4 py-2 rounded-2xl font-semibold text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-sky-400 transition-colors duration-150";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold text-gray-700 mb-6">Tambah Setoran</h2>

      {/* Peserta */}
      <label className="block text-sm font-semibold text-gray-500 mb-1">
        Peserta
      </label>
      <select
        value={tadarusUser}
        onChange={(e) => setTadarusUser(e.target.value)}
        className={`${inputClass} mb-4`}
      >
        <option value="">Pilih peserta...</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      {/* From */}
      <label className="block text-sm font-semibold text-gray-500 mb-1">
        Dari
      </label>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Surah..."
          value={fromSurah}
          onChange={(e) => setFromSurah(e.target.value)}
          className={inputClass}
        />
        <input
          type="number"
          placeholder="Ayat"
          value={fromAyah}
          onChange={(e) => setFromAyah(e.target.value)}
          className={`${inputClass} w-28`}
        />
      </div>

      {/* To */}
      <label className="block text-sm font-semibold text-gray-500 mb-1">
        Sampai
      </label>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Surah..."
          value={toSurah}
          onChange={(e) => setToSurah(e.target.value)}
          className={inputClass}
        />
        <input
          type="number"
          placeholder="Ayat"
          value={toAyah}
          onChange={(e) => setToAyah(e.target.value)}
          className={`${inputClass} w-28`}
        />
      </div>

      {/* Note */}
      <label className="block text-sm font-semibold text-gray-500 mb-1">
        Catatan <span className="font-normal text-gray-400">(opsional)</span>
      </label>
      <input
        type="text"
        placeholder="Catatan..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className={`${inputClass} mb-6`}
      />

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-2xl bg-gray-200 font-semibold text-gray-600 shadow-[0_2px_0_0_rgba(0,0,0,0.1)] active:translate-y-[2px] active:shadow-none hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.1)] transition-all duration-150"
        >
          Batal
        </button>
        <button
          onClick={handleSubmit}
          disabled={
            loading ||
            !tadarusUser ||
            !fromSurah ||
            !fromAyah ||
            !toSurah ||
            !toAyah
          }
          className="px-4 py-2 rounded-2xl bg-sky-500 text-white font-semibold shadow-[0_2px_0_0_rgba(0,0,0,0.3)] active:translate-y-[2px] active:shadow-none hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.3)] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </Modal>
  );
}
