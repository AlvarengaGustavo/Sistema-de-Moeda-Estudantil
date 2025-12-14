import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { Observable, catchError, throwError } from 'rxjs';
import { handlePrismaError } from './prisma-error.handler';

@Injectable()
export class PrismaExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          return throwError(() => handlePrismaError(error));
        }

        return throwError(() => error as Error);
      }),
    );
  }
}
