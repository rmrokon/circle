import fs from 'fs';
import { FileServer } from './FileServer';
import { GenericFile } from './types';

export class LocalFileUploader implements FileServer<GenericFile> {
  private basePath: string;
  constructor(basePath: string) {
    this.basePath = basePath;
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath);
    }
  }

  async read(path: string): Promise<Buffer> {
    const filepath = `${path}`;
    return new Promise<Buffer>((resolve, reject) => {
      if (!fs.existsSync(filepath)) {
        reject(new Error("File doesn't exists"));
        return;
      }
      const content: Buffer = fs.readFileSync(filepath);
      const stats = fs.statSync(filepath);
      resolve(content);
    });
  }
  async upload(file: GenericFile): Promise<GenericFile> {
    return new Promise<GenericFile>((resolve, reject) => {
      try {
        fs.writeFileSync(this.basePath + '/' + file.name, file.content);
        resolve(file);
      } catch (error) {
        reject(error);
      }
    });
  }
}
