export interface File {
  filename: string;
  filepath: string;
  created_at: string;
  updated_at: string;
  description?: string;
  mimeType?: string;
  private?: '0' | '1';
}
