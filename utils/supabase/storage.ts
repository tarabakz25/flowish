import type { FileOptions } from '@supabase/storage-js';

import { createClient } from './client';

export type UploadToBucketArgs = {
  bucket: string;
  path: string;
  file: File;
  options?: FileOptions;
};

export const uploadToBucket = async ({ bucket, path, file, options }: UploadToBucketArgs) => {
  const supabase = createClient();
  return supabase.storage.from(bucket).upload(path, file, options);
};

export const getPublicUrl = (bucket: string, path: string) => {
  const supabase = createClient();
  return supabase.storage.from(bucket).getPublicUrl(path);
};

