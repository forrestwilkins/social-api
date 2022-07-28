import { Request } from "express";
import * as fs from "fs";
import { extname } from "path";
import { promisify } from "util";

export const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error("Only image files are allowed"), false);
  }
  callback(null, true);
};

export const editFileName = (
  _req: Request,
  file: Express.Multer.File,
  callback: (error: Error, filename: string) => void
) => {
  const fileExtName = extname(file.originalname);
  callback(null, `${generateImageName()}${fileExtName}`);
};

export const generateImageName = (): string =>
  Math.random()
    .toString(36)
    .slice(2, 10)
    .split("")
    .map((c) => (Math.random() < 0.5 ? c : c.toUpperCase()))
    .join("");

export const deleteImage = async (filename: string) => {
  const unlinkAsync = promisify(fs.unlink);
  const path = `./uploads/${filename}`;
  await unlinkAsync(path);
};
