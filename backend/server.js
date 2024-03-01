#!/usr/bin/env node
import * as mediasoup from 'mediasoup';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server, Socket } from 'socket.io';

import { Sequelize, DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'node:crypto';

import swaggerJsDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';

import { config } from './config.js';
import Room from './models/room.model.js';
import User from './models/user.model.js';

// db instance
let sequelize;

// HTTP server.
let httpServer;

// Express application.
let expressApp;

run()

async function run() {
    await initDatabase();

    await createExpressApp();

    await runHttpsServer();
}

async function initDatabase() {
    sequelize = new Sequelize(config.databaseOptions.connectionString, {
        dialectOptions: {
            ssl: {
                require: false,
            }
        },
        models: [
            Room,
            User
        ],
    });
    await sequelize.sync();
}

async function createExpressApp() {
    console.info('creating Express app...');

    expressApp = express();
    expressApp.use(express.json());
    expressApp.use(cors(
        config.corsOptions
    ));

    const swaggerDocs = swaggerJsDoc(config.swaggerOptions);
    expressApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));



    // // Middleware для отлова всех входящих запросов
    // expressApp.use((req, res, next) => {
    //     console.log('Запрос на:', req);
    //     next(); // Передаем управление следующему middleware в цепочке
    // });

    // // Это обработчик маршрута
    // expressApp.get('/', (req, res) => {
    //     res.send('Добро пожаловать на главную страницу');
    // });

expressApp.post('/api/login', (req, res) => {
    console.log(req.body)
    res.send('Добро пожаловать на главную страницу');
});

    /** 
     * @swagger
     * /api/create-room:
     *   post:
     *     tags:
     *       - Room API
     *     description: Создает комнату и добавляет ее в базу. 
     *     responses:
     *       201:
     *         description: Success
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               example:
     *                   id: 00000000-0000-0000-0000-000000000000
     *                   name: My room
     *                   public: true
     *                   createdAt: 2022-01-01T00:00:00.000Z
     *                   updatedAt: null   
    */
    expressApp.post('/api/create-room', async (req, res) => {
        const uuid = uuidv4();
        const room = await Room(sequelize).create({
            id: uuid,
            name: uuid,
            public: true
        });
        res.status(201).json(room);
    })

    /**
     * @swagger
     * /api/vanish-room:
     *   post:
     *     tags:
     *       - Room API
     *     description: Удаляет комнату из базы.
     *     responses:
     *       204:
     *         description: Success
     */
    expressApp.post('/api/vanish-room', async (req, res) => {
        const room = await Room(sequelize).findOne({
            // id from query
            where: { id: req.query.id }
        })
        if (room) {
            await room.destroy();
        }

        res.sendStatus(204);
    })

    expressApp.get('/api/get-room', async (req, res) => {
        if (!req.query.id || uuidv4().match(req.query.id)) {
            return res.sendStatus(400);
        }

        const room = await Room(sequelize).findOne({
            where: { id: req.query.id, public: true }
        })

        if (!room) {
            return res.sendStatus(404);
        }

        res.json(room);
    })

    /**
    * @swagger
    * /get-public-rooms-list:
    *   get:
    *     tags:
    *       - Room API
    *     description: Возвращает список комнат.
    *     responses:
    *       200:
    *         description: Success
    *         content:
    *           application/json:
    *             schema:
    *               type: array
    *               example:
    *                 - id: 00000000-0000-0000-0000-000000000000
    *                   name: My room
    *                   public: true
    *                   createdAt: 2022-01-01T00:00:00.000Z
    *                   updatedAt: null
    */
    expressApp.get('/api/get-public-rooms', async (req, res) => {
        const rooms = await Room(sequelize).findAll({
            where: { public: true }
        })
        res.json(rooms);
    });

    /**
     * @swagger
     * /get-all-rooms-list:
     *   get:
     *     tags:
     *       - Room API
     *     description: Возвращает список комнат.
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               example:
     *                 - id: 00000000-0000-0000-0000-000000000000
     *                   name: My room
     *                   public: true
     *                   createdAt: 2022-01-01T00:00:00.000Z
     *                   updatedAt: null
    */
    expressApp.get('/api/get-all-rooms', async (req, res) => {
        const rooms = await Room(sequelize).findAll({})
        res.json(rooms);
    });

    /**
     * @swagger
     * /generate-uuid:
     *   get:
     *     tags:
     *       - Room API
     *     description: Возвращает уникальный идентификатор (uuid v4) комнаты.
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *           application/json:
     *             schema:
     *               type: string
     *               example: 00000000-0000-0000-0000-000000000000
     *        
     */
    expressApp.get('/api/generate-uuid', (req, res) => {
        return res.send(uuidv4());
    });
    // пока не работает, разбираюсь с орм
    // expressApp.post('/api/login', async (req, res) => {
    //     let email = req.body.email;
    //     let password = req.body.password;
    //     let passwordHash = createHash('sha256').update(password).digest('hex');
    //     console.log(passwordHash);

    //     const user = await User(sequelize).findOne({
    //         where: {
    //             email: email,
    //             passwordHash: passwordHash
    //         }
    //     });

    // });
}

async function runHttpsServer() {
    console.info('running HTTP server...');

    httpServer = http.createServer(expressApp);

    await new Promise((resolve) => {
        httpServer.listen(
            Number(config.http.listenPort), config.http.listenIp, resolve);
    });
    console.info(`HTTP server listening on http://127.0.0.1:${config.http.listenPort}`);
}
