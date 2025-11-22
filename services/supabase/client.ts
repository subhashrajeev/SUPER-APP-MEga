/**
 * Supabase Client Wrapper
 * Handles authentication and storage operations
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`File upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Upload multiple files
 */
export async function uploadFiles(
  bucket: string,
  files: Array<{ path: string; file: File }>
): Promise<string[]> {
  const uploads = files.map(({ path, file }) => uploadFile(bucket, path, file));
  return Promise.all(uploads);
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`File deletion failed: ${error.message}`);
  }
}

/**
 * Get signed URL for private file
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error || !data) {
    throw new Error(`Failed to create signed URL: ${error?.message}`);
  }

  return data.signedUrl;
}

/**
 * List files in bucket
 */
export async function listFiles(
  bucket: string,
  path: string = ''
): Promise<any[]> {
  const { data, error } = await supabase.storage.from(bucket).list(path);

  if (error) {
    throw new Error(`Failed to list files: ${error.message}`);
  }

  return data || [];
}
