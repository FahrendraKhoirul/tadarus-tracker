import { useState } from "react";
import Modal from "./Modal";
import type { TadarusDTO } from "../dto/tadarusDto";
import type { TadarusUserDto } from "../dto/tadarusUserDto";
import type { TadarusItemDto } from "../dto/tadarusItemDto";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tadarus: TadarusDTO;
  members: TadarusUserDto[];
  items: TadarusItemDto[];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function toDateKey(isoString?: string): string {
  if (!isoString) return "unknown";
  const date = new Date(isoString);
  // Use local date parts to avoid UTC vs local timezone mismatch
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDateKey(key: string): string {
  if (key === "unknown") return "📅 Tanggal tidak diketahui";
  const date = new Date(key + "T00:00:00");
  return "📅 " + formatDate(date);
}

function buildSummary(
  tadarus: TadarusDTO,
  members: TadarusUserDto[],
  items: TadarusItemDto[],
): string {
  const lines: string[] = [];
  lines.push("➡️ https://tadarus-tracker.vercel.app/ ⬅️");
  lines.push(`*TADARUS: ${tadarus.name.toUpperCase()}*`);
  lines.push(`${tadarus.description}`);
  lines.push(
    new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  );
  lines.push("");
  lines.push("🗒️List");

  // Sort all items oldest first
  const sortedItems = [...items].sort((a, b) =>
    (a.created_at ?? "").localeCompare(b.created_at ?? ""),
  );

  const memberMap: Record<number, string> = {};
  for (const m of members) memberMap[m.id] = m.name;

  // Only keep the last 5 days of activity
  const uniqueDateKeys = Array.from(
    new Set(sortedItems.map((item) => toDateKey(item.created_at))),
  );
  const last5DateKeys = new Set(uniqueDateKeys.slice(-5));

  let lastDateKey = "";
  for (const item of sortedItems) {
    const dateKey = toDateKey(item.created_at);
    if (!last5DateKeys.has(dateKey)) continue;

    if (dateKey !== lastDateKey) {
      if (lastDateKey !== "") lines.push(""); // blank line between date sections
      lines.push(formatDateKey(dateKey));
      lastDateKey = dateKey;
    }
    const memberName = memberMap[item.tadarus_user] ?? "Unknown";
    lines.push(
      `${memberName} : ${item.from_surah} ${item.from_ayah} - ${item.to_surah} ${item.to_ayah}`,
    );
  }

  return lines.join("\n").trimEnd();
}

export default function SummaryModal({
  isOpen,
  onClose,
  tadarus,
  members,
  items,
}: Props) {
  const [copied, setCopied] = useState(false);

  const summary = buildSummary(tadarus, members, items);
  const summaryLines = summary.split("\n");
  const previewSummary =
    summaryLines.length > 15
      ? summaryLines.slice(0, 15).join("\n") + "\n....."
      : summary;

  async function handleCopy() {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold text-gray-700 mb-4">
        Yuk Kabarin Teman-teman Grup
      </h2>

      {/* Preview */}
      <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 bg-gray-100 rounded-2xl p-4 mb-6 border-2 border-gray-200 leading-relaxed">
        {previewSummary}
      </pre>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-2xl bg-gray-200 font-semibold text-gray-600 shadow-[0_2px_0_0_rgba(0,0,0,0.1)] active:translate-y-[2px] active:shadow-none hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.1)] transition-all duration-150"
        >
          Tutup
        </button>
        <button
          onClick={handleCopy}
          className="px-4 py-2 rounded-2xl bg-sky-500 text-white font-semibold shadow-[0_2px_0_0_rgba(0,0,0,0.3)] active:translate-y-[2px] active:shadow-none hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.3)] transition-all duration-150"
        >
          {copied ? "✅ Tersalin!" : "📋 Salin"}
        </button>
      </div>
    </Modal>
  );
}
