import { Request } from "express";
import * as fs from "fs";
import { FileUpload } from "graphql-upload-minimal";
import { extname } from "path";
import { promisify } from "util";

export const DEFAULT_IMAGES_SIZE = 10;

// TODO: Add remaining logic - the following is a WIP
export const saveImage = async (image: Promise<FileUpload>) => {
  const { createReadStream, mimetype } = await image;
  const extension = mimetype.split("/")[1];
  const filename = `${generateImageName()}.${extension}`;
  const path = `./uploads/${filename}`;

  await new Promise((resolve, reject) => {
    const stream = createReadStream();
    stream
      .pipe(fs.createWriteStream(path))
      .on("error", (error: Error) => {
        fs.unlink(path, () => {
          reject(error);
        });
      })
      .on("finish", resolve);
  });

  return filename;
};

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

export const generateImageName = () =>
  Math.random()
    .toString(36)
    .slice(2, 10)
    .split("")
    .map((c) => (Math.random() < 0.5 ? c : c.toUpperCase()))
    .join("");

export const randomDefaultImagePath = () =>
  `./src/images/assets/defaults/${
    Math.floor(Math.random() * DEFAULT_IMAGES_SIZE) + 1
  }.jpeg`;

export const deleteImage = async (filename: string) => {
  const unlinkAsync = promisify(fs.unlink);
  const path = `./uploads/${filename}`;
  await unlinkAsync(path);
};
