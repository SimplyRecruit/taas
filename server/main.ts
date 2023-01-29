import 'reflect-metadata' /* this shim is required */
import express, { Request, Response } from "express"
import next from "next"
import { DataSource } from "typeorm"
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { useExpressServer } from 'routing-controllers'
import { join } from "path"
import { authorizationChecker, currentUserChecker } from '~/resources/User/AuthService';
import smtp from '@sendgrid/mail'

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

// Resolving environment variables
import "dotenv/config"

// Controllers
import UserController from '~/resources/User/Controller';
import ResourceController from '~/resources/Resource/Controller';
import WorkPeriodController from '~/resources/WorkPeriod/Controller';
import CustomerController from '~/resources/Customer/Controller';

// Connecting to DB
const dataSource = new DataSource({
    type: "postgres",
    url: process.env.DB_CSTR,
    entities: [
        join(__dirname, './resources/**/*Entity.{ts,js}'),
        join(__dirname, './resources/relations/**/*.{ts,js}'),
    ], // [PersonEntity, HatEntity],
    logging: false,
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
})

dataSource.initialize().then(() => {
    console.info("Connected to DB")
}).catch((error: unknown) => {
    console.error("Error connecting to DB:")
    console.error(error)
});

// Set SMTP API Key
smtp.setApiKey(process.env.SMTP_KEY!);

(async () => {
    try {
        // Create express server
        await app.prepare();
        const server = express();
        useExpressServer(server, {
            authorizationChecker: authorizationChecker,
            currentUserChecker: currentUserChecker,
            controllers: [UserController, ResourceController, WorkPeriodController, CustomerController],
            routePrefix: '/api',
            validation: { validationError: { target: false, value: false }, whitelist: true, forbidNonWhitelisted: true },
            cors: true,
            classTransformer: true,
            defaults: {
                paramOptions: { required: true }
            },
            middlewares: [], //[CustomErrorHandler],
            defaultErrorHandler: true //false
        });

        // Send 404 for not found APIs
        server.all('/api/*', (req: Request, res: Response) => {
            if (!res.writableEnded) res.status(404).send("API not found")
            else res.end()
        })

        // Send to frontend if url does not start with /api
        server.all('*', (req: Request, res: Response) => {
            return handle(req, res);
        });

        // Start listening to requests
        server.listen(port, (err?: unknown) => {
            if (err) throw err;
            console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV ?? "development"}`);
        });

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();

export { dataSource, smtp }
