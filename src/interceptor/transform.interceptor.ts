import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  apiKeyInfo?: {
    // Nueva propiedad opcional
    name: string;
    key: string;
    expiresAt: Date;
    allowedIps: string[];
  };
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request['apiKey']; // Obtenemos la API Key del request
    return next.handle().pipe(
      map((data: any) => {
        const response: Response<T> = {
          statusCode:
            data.status || context.switchToHttp().getResponse().statusCode,
          message:
            this.reflector.get<string>(
              'response_message',
              context.getHandler(),
            ) ||
            data.message ||
            '',
          data: data,
          timestamp: new Date().toISOString(),
        };

        // Agregamos la info de la API Key si existe
        // if (apiKey) {
        //   response.apiKeyInfo = {
        //     name: apiKey.name,
        //     key: apiKey.key,
        //     expiresAt: new Date(apiKey.expires_at * 1000), // Convertir a milisegundos
        //     allowedIps: apiKey.ips,
        //   };
        // }

        return response;
      }),
    );
  }
}
