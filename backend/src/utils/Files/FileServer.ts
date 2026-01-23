export interface FileServer<T> {
  upload(file: T, options?: any): Promise<T>;
  read(path: string): Promise<Buffer | undefined>;
}
