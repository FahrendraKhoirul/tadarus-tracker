import { useEffect, useState } from "react";
import { getTadarusUsersByTadarus } from "../api/tadarusApi";
import type { TadarusUserDto } from "../dto/tadarusUserDto";

export function useTadarusUser(id: string) {
  const [dataTadarusUser, setDataTadarusUser] = useState<TadarusUserDto[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    const res = await getTadarusUsersByTadarus(Number(id));
    setDataTadarusUser(res);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return { dataTadarusUser, loading, refetch: fetchData };
}
