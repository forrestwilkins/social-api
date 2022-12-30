import * as fs from "fs";
import { FileUpload } from "graphql-upload";
import { promisify } from "util";

export const DEFAULT_IMAGES_SIZE = 10;

// TODO: Add remaining logic - the following is a WIP
export const saveImage = async (image: Promise<FileUpload>) => {
  const { createReadStream, mimetype } = await image;
  const extension = mimetype.split("/")[1];
  const filename = `${Date.now()}.${extension}`;
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

export const randomDefaultImagePath = () =>
  `./src/images/assets/defaults/${
    Math.floor(Math.random() * DEFAULT_IMAGES_SIZE) + 1
  }.jpeg`;

export const deleteImageFile = async (filename: string) => {
  const unlinkAsync = promisify(fs.unlink);
  const path = `./uploads/${filename}`;
  await unlinkAsync(path);
};
