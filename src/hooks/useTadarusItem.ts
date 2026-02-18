import { useEffect, useState } from "react";
import { getTadarusItems } from "../api/tadarusApi";
import type { TadarusItemDto } from "../dto/tadarusItemDto";

export function useTadarusItem(id: string) {
  const [dataTadarusItem, setDataTadarusItem] = useState<TadarusItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    const res = await getTadarusItems(Number(id));
    setDataTadarusItem(res);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return { dataTadarusItem, loading, refetch: fetchData };
}
