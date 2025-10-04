import { diskStorage } from 'multer';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export const excelUploadConfig = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            if (!req.tempDir) {
                req.tempDir = path.join(process.cwd(), 'uploads/temp_queue', crypto.randomUUID());
                fs.mkdirSync(req.tempDir, { recursive: true });
            }
            cb(null, req.tempDir);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname); // giữ nguyên tên file gốc
        }
    })
};