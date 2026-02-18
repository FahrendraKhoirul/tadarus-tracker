import { useState } from "react";
import Modal from "./Modal";
import { createTadarusUser } from "../api/tadarusApi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tadarusId: string;
  onSuccess: () => void;
}

export default function AddUserModal({
  isOpen,
  onClose,
  tadarusId,
  onSuccess,
}: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!name) return;

    setLoading(true);
    await createTadarusUser(name, tadarusId);
    setLoading(false);
    setName("");
    onSuccess();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold text-gray-700 mb-6">Tambah Peserta</h2>

      <input
        type="text"
        placeholder="Nama peserta..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border-2 border-gray-300 w-full px-4 py-2 rounded-2xl mb-6 font-semibold text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-sky-400 transition-colors duration-150"
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
          disabled={loading}
          className="px-4 py-2 rounded-2xl bg-sky-500 text-white font-semibold shadow-[0_2px_0_0_rgba(0,0,0,0.3)] active:translate-y-[2px] active:shadow-none hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.3)] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </Modal>
  );
}
