/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ExpressErrorMiddlewareInterface,
  Middleware,
} from 'routing-controllers'

@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any): void {
    if (error.status) return response.status(error.status).send('Error')
    else if (error.httpCode == null)
      return response.status(500).send('Internal Server Error')
    else
      return response
        .status(error.httpCode)
        .send(error.name + (error.message ? ': ' + error.message : ''))
  }
}
