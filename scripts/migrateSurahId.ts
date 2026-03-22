import Fuse from "fuse.js";
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config(); // load .env

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
// Use service role key to bypass RLS for migration scripts
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const normalize = (s: string) => s.trim().toLowerCase().replace(/-/g, " ");

async function migrate() {
  console.log("🚀 Start migration for tadarus_id = 1");
  const { data: surahs, error: surahsError } = await supabase
    .from("surahs")
    .select("*");
  if (surahsError) throw surahsError;

  console.log("Surahs Data", surahs);

  const { data: tadarusItems, error: tadarusItemsError } = await supabase
    .from("tadarus_item")
    .select("*")
    .eq("tadarus_id", 1);

  if (tadarusItemsError) throw tadarusItemsError;

  console.log("Tadarus Items Data", tadarusItems);

  const surahMap = new Map(surahs.map((s) => [normalize(s.nama_latin), s.id]));

  const fuse = new Fuse(surahs, {
    keys: ["nama_latin"],
    threshold: 0.3,
  });

  let success = 0;
  let failed = 0;

  for (const item of tadarusItems) {
    const fromKey = normalize(item.from_surah);
    const toKey = normalize(item.to_surah);

    let fromId = surahMap.get(fromKey);
    let toId = surahMap.get(toKey);

    // fuzzy fallback
    if (!fromId) {
      const match = fuse.search(item.from_surah)[0];
      fromId = match?.item?.id;
    }

    if (!toId) {
      const match = fuse.search(item.to_surah)[0];
      toId = match?.item?.id;
    }

    if (!fromId || !toId) {
      console.log("❌ FAILED:", {
        id: item.id,
        from: item.from_surah,
        to: item.to_surah,
      });
      failed++;
      continue;
    }

    // update ke supabase
    const { error: updateError } = await supabase
      .from("tadarus_item")
      .update({
        from_surah_id: fromId,
        to_surah_id: toId,
      })
      .eq("id", item.id)
      .is("from_surah_id", null);

    if (updateError) {
      console.log("❌ UPDATE ERROR:", item.id, updateError);
      failed++;
      continue;
    }

    console.log(`✅ Updated item ${item.id}`);
    success++;
  }

  console.log("🎉 DONE");
  console.log("Success:", success);
  console.log("Failed:", failed);
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
