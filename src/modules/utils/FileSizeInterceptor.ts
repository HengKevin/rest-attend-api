import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MulterFile } from 'multer';
@Injectable()
export class FileSizeInterceptor implements NestInterceptor {
  constructor(private readonly maxSize: number) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const file: MulterFile = request.file; // Customize this based on your file handling

    if (file && file.size > this.maxSize) {
      // Throw an error if the file size exceeds the specified limit
      throw new Error('File size exceeds the maximum allowed limit');
    }

    return next.handle().pipe(
      catchError((error) => {
        // Catch any errors that occur during the request handling
        if (
          file &&
          error instanceof Error &&
          error.message === 'File size exceeds the maximum allowed limit'
        ) {
          // Customize the error response as per your requirements
          throw new BadRequestException(
            'File size exceeds the maximum allowed limit',
          );
        }

        return throwError(error);
      }),
    );
  }
}
