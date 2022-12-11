import { UnsupportedMediaTypeException } from "@nestjs/common";
import { Request } from "express";
import * as fs from "fs";
import { extname } from "path";
import { promisify } from "util";

export const DEFAULT_IMAGES_SIZE = 10;

export const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return callback(
      new UnsupportedMediaTypeException("Only image files are allowed"),
      false
    );
  }
  callback(null, true);
};

export const editFileName = (
  _req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void
) => {
  const fileExtName = extname(file.originalname);
  callback(null, `${Date.now()}${fileExtName}`);
};

export const randomDefaultImagePath = () =>
  `./src/images/assets/defaults/${
    Math.floor(Math.random() * DEFAULT_IMAGES_SIZE) + 1
  }.jpeg`;

export const deleteImageFile = async (filename: string) => {
  const unlinkAsync = promisify(fs.unlink);
  const path = `./uploads/${filename}`;
  await unlinkAsync(path);
};
