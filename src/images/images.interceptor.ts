import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Image } from "./models/image.model";

const addTypename = (image: Image) => ({ ...image, __typename: "Image" });

/**
 * Adds __typename property for images returned by controllers
 * to ensure that Apollo Client can easily cache them on the FE
 */
@Injectable()
export class ImagesInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: Image | Image[]) => {
        if (data instanceof Array) {
          return data.map((image) => addTypename(image));
        }
        return addTypename(data);
      })
    );
  }
}
