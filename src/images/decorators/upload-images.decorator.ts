import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { diskStorage } from "multer";
import { editFileName, imageFileFilter } from "../image.utils";

export const DEFAULT_MULTER_OPTIONS: MulterOptions = {
  storage: diskStorage({
    // TODO: Determine why settting destination with a variable
    // or constant causes images to not save to disk
    destination: "./uploads",
    filename: editFileName,
  }),
  fileFilter: imageFileFilter,
};

export const UploadImages = (
  fieldName = "images",
  maxCount = 10,
  required = true,
  localOptions = DEFAULT_MULTER_OPTIONS
) =>
  applyDecorators(
    UseInterceptors(FilesInterceptor(fieldName, maxCount, localOptions)),
    ApiConsumes("multipart/form-data"),
    ApiBody({
      schema: {
        type: "object",
        properties: {
          [fieldName]: {
            type: "array",
            items: {
              type: "string",
              format: "binary",
            },
          },
        },
        required: required ? [fieldName] : [],
      },
    })
  );
