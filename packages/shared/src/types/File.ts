import { ItemID } from "./ItemID";

export interface File {
  id: ItemID;
  filename: string;
  filepath: string;
  created_at: string;
  updated_at: string;
  description?: string;
  mimeType?: string;
  private?: '0' | '1';
}