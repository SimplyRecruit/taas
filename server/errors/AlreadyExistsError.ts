import { HttpError } from 'routing-controllers'
/**
 * Exception for 409 HTTP error.
 */
export class AlreadyExistsError extends HttpError {
  name = 'AlreadyExistsError'
  constructor(message?: string) {
    super(409, message)
    Object.setPrototypeOf(this, AlreadyExistsError.prototype)
  }
}
