export interface GenericFile {
  content: Buffer;
  name: string;
  size?: number;
  type: string;
  extension?: string;
  originalname: string;
  mimetype?: string;
  path: string;
}
