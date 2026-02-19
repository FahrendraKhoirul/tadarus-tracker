import { useState } from "react";
import Modal from "./Modal";
import { createTadarus } from "../api/tadarusApi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddTadarusModal({ isOpen, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  function reset() {
    setName("");
    setDescription("");
  }

  async function handleSubmit() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createTadarus(name.trim(), description.trim());
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
      <h2 className="text-xl font-bold text-gray-700 mb-6">Buat Kelompok</h2>

      <label className="block text-sm font-semibold text-gray-500 mb-1">
        Nama Kelompok
      </label>
      <input
        type="text"
        placeholder="Nama kelompok..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={`${inputClass} mb-4`}
      />

      <label className="block text-sm font-semibold text-gray-500 mb-1">
        Deskripsi <span className="font-normal text-gray-400">(opsional)</span>
      </label>
      <input
        type="text"
        placeholder="Deskripsi kelompok..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={`${inputClass} mb-6`}
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-2xl bg-gray-200 font-semibold text-gray-600 shadow-[0_2px_0_0_rgba(0,0,0,0.1)] active:translate-y-[2px] active:shadow-none hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.1)] transition-all duration-150"
        >
          Batal
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || !name.trim()}
          className="px-4 py-2 rounded-2xl bg-sky-500 text-white font-semibold shadow-[0_2px_0_0_rgba(0,0,0,0.3)] active:translate-y-[2px] active:shadow-none hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.3)] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Menyimpan..." : "Buat"}
        </button>
      </div>
    </Modal>
  );
}
