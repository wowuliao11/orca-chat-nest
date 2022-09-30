import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { inspect } from 'util';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const req: Request = context.getArgByIndex(1).req;

    const { url } = req;

    return next.handle().pipe(
      map((data) => {
        const response: Response = context.switchToHttp().getResponse();

        const responseData = {
          status: response.statusCode,
          payload: data,
          message: 'succeed',
          code: 0,
          url,
        };

        return responseData;
      }),
    );
  }
}
