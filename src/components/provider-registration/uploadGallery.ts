import { supabase } from "@/integrations/supabase/client";
import { GalleryImage } from "./GalleryUploadSection";

/**
 * Uploads gallery images to the public `provider-gallery` bucket and creates
 * rows in `provider_gallery`. Failures are logged but never thrown.
 */
export async function uploadProviderGallery(
  providerId: string,
  userId: string,
  images: GalleryImage[]
): Promise<{ uploaded: number; failed: number }> {
  let uploaded = 0;
  let failed = 0;

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    try {
      const ext = img.file.name.split(".").pop() || "jpg";
      // Storage RLS expects user_id as the first folder
      const path = `${userId}/${providerId}/gallery-${Date.now()}-${i}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("provider-gallery")
        .upload(path, img.file, {
          cacheControl: "3600",
          upsert: false,
          contentType: img.file.type,
        });

      if (upErr) {
        console.error("Gallery upload failed:", upErr);
        failed++;
        continue;
      }

      const { data: pub } = supabase.storage.from("provider-gallery").getPublicUrl(path);

      const { error: dbErr } = await supabase.from("provider_gallery").insert({
        provider_id: providerId,
        image_url: pub.publicUrl,
        display_order: i,
      });

      if (dbErr) {
        console.error("Gallery DB insert failed:", dbErr);
        failed++;
        continue;
      }

      uploaded++;
    } catch (e) {
      console.error("Unexpected gallery error:", e);
      failed++;
    }
  }

  return { uploaded, failed };
}
