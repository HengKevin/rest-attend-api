import { ExceptionFilter, Catch, ArgumentsHost, HttpException, UnauthorizedException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express'


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    ctx.getRequest<Request>()
    exception.getStatus()
    response.send({
      statusCode: exception.getStatus(),
      message: exception.message,
    })
  }
}


@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter extends BaseExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    response.send({
      statusCode: 401,
      message: exception.message.replace('UnauthorizedException: ', ''),
    });
  }
}
export class sendRespone implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    response.send({
      statusCode: exception.getStatus(),
      message: exception.message,
    })
  }
}