/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express';

const allowedTypes = {
  attachment: {
    allowed: ['application/pdf'],
    message: 'Only PDF type file is allowed',
  },
  logo: {
    allowed: ['image/png', 'image/jpeg'],
    message: 'Only JPEG OR PNG type file is allowed',
  },
  avatar: {
    allowed: ['image/png'],
    message: 'Only PNG type file is allowed',
  },
  'import/categories': {
    allowed: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    message: 'Only excel type files are allowed',
  },
  'import/customers': {
    allowed: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    message: 'Only excel type files are allowed',
  },
  'import/invoices': {
    allowed: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    message: 'Only excel type files are allowed',
  },
  'import/accounts': {
    allowed: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    message: 'Only excel type files are allowed',
  },
  import: {
    allowed: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'],
    message: 'Only excel and csv type files are allowed',
  },
};

export const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  const fileType = allowedTypes[(req.body?.type || '') as keyof typeof allowedTypes];
  if (fileType?.allowed?.includes(file.mimetype)) {
    if (file.size > 10 * 1024 * 1024) {
      cb(new Error('400:-File size exceeds the maximum limit of 10MB'), false);
    } else {
      cb(null, true);
    }
  } else {
    cb(new Error(fileType?.message || '400:-Invalid file type. Only JPEG, PNG or PDF are allowed.'), false);
  }
};
