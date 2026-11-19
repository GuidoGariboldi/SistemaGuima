import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger, } from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const isHttp = exception instanceof HttpException;

        const status = isHttp
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        // exception.getResponse() de un HttpException de Nest NO es el string
        // del mensaje — es un objeto { statusCode, message, error }. Si lo
        // mandábamos entero acá, el frontend recibía un objeto anidado
        // adentro de "message" en vez del texto, y terminaba mostrando
        // literalmente "[object Object]".
        let message: unknown;
        if (isHttp) {
            const body = exception.getResponse();
            message = typeof body === 'string' ? body : (body as any)?.message ?? exception.message;
        } else {
            message = (exception as Error)?.message ?? 'Error interno del servidor';
        }

        this.logger.error(
            `${request.method} ${request.url}->${status}`,
            (exception as Error)?.stack,
        )

        response.status(status).json({
            statusCode: status,
            path: request.url,
            timestamp: new Date().toISOString(),
            message,
        })
    }
}
