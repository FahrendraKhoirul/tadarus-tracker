export interface TadarusItemDto {
  id: number;
  tadarus_id: number;
  tadarus_user: number;
  from_surah: string;
  from_ayah: number;
  to_surah: string;
  to_ayah: number;
  note: string;
  created_at?: string;
}
