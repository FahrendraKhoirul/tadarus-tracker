import { useEffect, useState } from "react";
import { getWrappedByTadarusId } from "../api/tadarusApi";
import type { WrappedDTO } from "../dto/wrappedDto";

export function useWrapped(tadarusId: string) {
  const [dataWrapped, setDataWrapped] = useState<WrappedDTO | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    const res = await getWrappedByTadarusId(Number(tadarusId));
    setDataWrapped(res);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return { dataWrapped, loading, refetch: fetchData };
}
