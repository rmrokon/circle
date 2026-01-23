import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdir('./uploads/', (err)=>{
      cb(null, './uploads/')
    })
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(16, function (err, raw) {
      cb(err, `${err ? "" : raw.toString('hex')}${path.extname(file.originalname)}`)
    })
  }
})

export const upload = multer({ storage: storage })
