import { FileServer } from './FileServer';
import { LocalFileUploader } from './LocalFileUploader';

enum FileUploadTypes {
  LOCAL = 'local',
  AWS_S3 = 'aws',
}

function fileUploadFactory() {
  return {
    get(type: string): FileServer<any> {
      switch (type) {
        case 'local':
          return new LocalFileUploader(process.env.FILE_PATH || '/var/files');
        default:
          return new LocalFileUploader(process.env.FILE_PATH || '/var/files');
      }
    },
    get types() {
      return FileUploadTypes;
    },
  };
}

export const FileUploadFactory = fileUploadFactory();
