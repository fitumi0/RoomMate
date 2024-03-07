#!/usr/bin/env node
import * as mediasoup from 'mediasoup';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server, Socket } from 'socket.io';

import { Sequelize, DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
// import { PrismaClient } from '@prisma/client'

import * as jwtModule from './libs/jwt.module.js';

import swaggerJsDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';

import { config } from './config.js';
import Room from './models/room.model.js';
import User from './models/user.model.js';

let sequelize;
let httpServer;
let expressApp;
let socketServer;
let mediasoupWorker;
let mediasoupRouter;
let producer;
let consumer;
let producerTransport;
let consumerTransport;
// let workers = [];


run()

async function run() {
    await initDatabase();
    await createMediaServer();
    await createExpressApp();
    await createHttpServer();
    await createSocketServer();
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

    Room(sequelize);
    User(sequelize);
    // await sequelize.sync({});
}

async function createMediaServer() {
    mediasoupWorker = await mediasoup.createWorker({
        logLevel: config.mediasoup.workerSettings.logLevel,
        logTags: config.mediasoup.workerSettings.logTags,
        rtcMinPort: Number(config.mediasoup.workerSettings.rtcMinPort),
        rtcMaxPort: Number(config.mediasoup.workerSettings.rtcMaxPort)
    });

    mediasoupWorker.on('died', () => {
        console.error(
            `mediasoup Worker [${mediasoupWorker.pid}] died, exiting  in 2 seconds... `);

        setTimeout(() => process.exit(1), 2000);
    });
    const mediaCodecs = config.mediasoup.routerOptions.mediaCodecs;
    mediasoupRouter = await mediasoupWorker.createRouter({ mediaCodecs });


    // TODO: add logger
    // TODO: add multiple workers


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



    // Middleware для отлова всех входящих запросов
    expressApp.use((req, res, next) => {
        console.log(`[${req.method}]:`, req.url);
        next(); // Передаем управление следующему middleware в цепочке
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

    /**
     * @swagger
     * /api/get-room/:id:
     *   get:
     *     tags:
     *       - Room API
     *     description: Возвращает комнату по id.
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     */
    expressApp.get('/api/get-room/:id', async (req, res) => {
        // todo: validate uuid or fix db query
        if (!req.params.id || uuidv4().match(req.params.id)) {
            return res.sendStatus(400);
        }

        const room = await Room(sequelize).findOne({
            where: { id: req.params.id, public: true }
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

async function createHttpServer() {
    console.info('running HTTP server...');

    httpServer = http.createServer(expressApp);

    await new Promise((resolve) => {
        httpServer.listen(
            Number(config.http.listenPort), config.http.listenIp, resolve);
    });
    console.info(`HTTP server listening on http://127.0.0.1:${config.http.listenPort}`);
}

async function createSocketServer() {
    socketServer = new Server(httpServer, {
        cors: config.corsOptions

    });

    socketServer.on('connection', (socket) => {
        socket.on('getRouterRtpCapabilities', async (callback) => {
            callback(mediasoupRouter.rtpCapabilities);
        });

        socket.on('createProducerTransport', async (callback) => {
            try {
                const { transport, params } = await createWebRtcTransport();
                producerTransport = transport;
                callback(params);
            } catch (err) {
                console.error(err);
                callback({ error: err.message });
            }
        });

        socket.on('createConsumerTransport', async (callback) => {
            try {
                const { transport, params } = await createWebRtcTransport();
                consumerTransport = transport;
                callback(params);
            } catch (err) {
                console.error(err);
                callback({ error: err.message });
            }
        });

        socket.on('connectProducerTransport', async (data, callback) => {
            await producerTransport.connect({ dtlsParameters: data.dtlsParameters });
            callback();
        });

        socket.on('connectConsumerTransport', async (data, callback) => {
            await consumerTransport.connect({ dtlsParameters: data.dtlsParameters });
            callback();
        });

        socket.on('produce', async (data, callback) => {
            const { kind, rtpParameters } = data;
            producer = await producerTransport.produce({ kind, rtpParameters });
            callback({ id: producer.id });

            // inform clients about new producer
            socket.broadcast.emit('newProducer');
        });

        socket.on('consume', async (data, callback) => {
            callback(await createConsumer(producer, data.rtpCapabilities));
        });

        socket.on('resume', async (data, callback) => {
            await consumer.resume();
            callback();
        });

    })
}

async function createWebRtcTransport() {
    const {
        maxIncomingBitrate,
        initialAvailableOutgoingBitrate
    } = config.mediasoup.webRtcTransportOptions;

    const transport = await mediasoupRouter.createWebRtcTransport({
        listenIps: config.mediasoup.webRtcTransportOptions.listenIps,
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
        initialAvailableOutgoingBitrate,
    });
    if (maxIncomingBitrate) {
        try {
            await transport.setMaxIncomingBitrate(maxIncomingBitrate);
        } catch (error) {
        }
    }
    return {
        transport,
        params: {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters
        },
    };
}

async function createConsumer(producer, rtpCapabilities) {
    if (!mediasoupRouter.canConsume(
        {
            producerId: producer.id,
            rtpCapabilities,
        })
    ) {
        console.error('can not consume');
        return;
    }
    try {
        consumer = await consumerTransport.consume({
            producerId: producer.id,
            rtpCapabilities,
            paused: producer.kind === 'video',
        });
    } catch (error) {
        console.error('consume failed', error);
        return;
    }

    if (consumer.type === 'simulcast') {
        await consumer.setPreferredLayers({ spatialLayer: 2, temporalLayer: 2 });
    }

    return {
        producerId: producer.id,
        id: consumer.id,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        type: consumer.type,
        producerPaused: consumer.producerPaused
    };
}