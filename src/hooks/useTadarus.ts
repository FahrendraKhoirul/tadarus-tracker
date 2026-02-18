import { useEffect, useState } from "react";
import { getTadarus } from "../api/tadarusApi";
import type { TadarusDTO } from "../dto/tadarusDto";

export function useTadarus() {
  const [dataTadarus, setDataTadarus] = useState<TadarusDTO[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    const res = await getTadarus();
    setDataTadarus(res);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return { dataTadarus, loading, refetch: fetchData };
}
