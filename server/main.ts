import smtp from '@sendgrid/mail'
import express, { Request, Response } from 'express'
import next from 'next'
import { join } from 'path'
import 'reflect-metadata' /* this shim is required */
import { useExpressServer } from 'routing-controllers'
import { DataSource } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import {
  authorizationChecker,
  currentUserChecker,
} from '~/resources/User/AuthService'
import { generateApiCalls } from '~/common/Util'

// Resolving environment variables
import 'dotenv/config'

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT ? Number.parseInt(process.env.PORT) : 3000
const hostname = process.env.HOST ?? 'localhost'
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()
console.log('ENV VAR TEST:', hostname, port)

// Connecting to DB
const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DB_CSTR,
  entities: [
    join(__dirname, './resources/**/*Entity.{ts,js}'),
    join(__dirname, './resources/relations/**/*.{ts,js}'),
  ],
  parseInt8: true,
  logging: false,
  synchronize: dev && true,
  namingStrategy: new SnakeNamingStrategy(),
})

dataSource
  .initialize()
  .then(() => {
    console.info('Connected to DB')
  })
  .catch((error: unknown) => {
    console.error('Error connecting to DB:')
    console.error(error)
  })

// Set SMTP API Key
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
smtp.setApiKey(process.env.SMTP_KEY!)
;(async () => {
  try {
    // Create express server
    await app.prepare()
    const server = express()
    useExpressServer(server, {
      authorizationChecker: authorizationChecker,
      currentUserChecker: currentUserChecker,
      controllers: [join(__dirname, './resources/**/*Controller.{ts,js}')],
      routePrefix: '/api',
      validation: {
        validationError: { target: false, value: false },
        whitelist: true,
        forbidNonWhitelisted: true,
      },
      cors: true,
      classTransformer: true,
      defaults: {
        paramOptions: { required: true },
      },
      middlewares: [], //[CustomErrorHandler],
      defaultErrorHandler: true, //false
    })

    // Send 404 for not found APIs
    server.all('/api/*', (req: Request, res: Response) => {
      if (!res.writableEnded) res.status(404).send('API not found')
      else res.end()
    })

    // Send to frontend if url does not start with /api
    server.all('*', (req: Request, res: Response) => {
      return handle(req, res)
    })

    // Start listening to requests
    server.listen(port, (err?: unknown) => {
      if (err) throw err
      console.log(
        `> Ready on localhost:${port} - env ${
          process.env.NODE_ENV ?? 'development'
        }`
      )
    })

    if (dev) await generateApiCalls()
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()

export { dataSource, smtp }
