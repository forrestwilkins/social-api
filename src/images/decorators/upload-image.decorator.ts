import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { diskStorage } from "multer";
import { editFileName, imageFileFilter } from "../image.utils";
import { UPLOADS_DIR } from "../images.module";

export const DEFAULT_MULTER_OPTIONS: MulterOptions = {
  storage: diskStorage({
    destination: UPLOADS_DIR,
    filename: editFileName,
  }),
  fileFilter: imageFileFilter,
};

export const UploadImage = (
  fieldName = "image",
  required = true,
  localOptions = DEFAULT_MULTER_OPTIONS
) =>
  applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, localOptions)),
    ApiConsumes("multipart/form-data"),
    ApiBody({
      schema: {
        type: "object",
        properties: {
          [fieldName]: {
            type: "string",
            format: "binary",
          },
        },
        required: required ? [fieldName] : [],
      },
    })
  );
