import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { UploadedDocument } from "./DocumentUploadSection";

/**
 * Uploads provider verification documents to the `provider-documents` storage bucket
 * and creates corresponding rows in the `provider_documents` table.
 *
 * Failures are logged but never thrown — registration must complete even if a
 * document fails to upload (the provider can re-upload from settings later).
 */
export async function uploadProviderDocuments(
  providerId: string,
  userId: string,
  documents: UploadedDocument[]
): Promise<{ uploaded: number; failed: number }> {
  let uploaded = 0;
  let failed = 0;

  for (const doc of documents) {
    if (!doc.file) {
      failed++;
      continue;
    }

    try {
      const fileExt = doc.file.name.split('.').pop() || 'bin';
      const safeName = `${doc.type}-${Date.now()}.${fileExt}`;
      // RLS on storage requires the first folder to be the user id
      const filePath = `${userId}/${providerId}/${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from('provider-documents')
        .upload(filePath, doc.file, {
          cacheControl: '3600',
          upsert: false,
          contentType: doc.file.type,
        });

      if (uploadError) {
        console.error(`Failed to upload ${doc.type}:`, uploadError);
        failed++;
        continue;
      }

      const { error: dbError } = await supabase
        .from('provider_documents')
        .insert({
          provider_id: providerId,
          document_type: doc.type,
          file_name: doc.fileName,
          file_url: filePath,
          status: 'pending',
        });

      if (dbError) {
        console.error(`Failed to record ${doc.type} in DB:`, dbError);
        failed++;
        continue;
      }

      uploaded++;
    } catch (err) {
      console.error(`Unexpected error uploading ${doc.type}:`, err);
      failed++;
    }
  }

  return { uploaded, failed };
}
