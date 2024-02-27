#!/usr/bin/env node
import * as mediasoup from 'mediasoup';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server, Socket } from 'socket.io';

import { Sequelize, DataTypes, Model } from 'sequelize';
import Room from './models/room.js';

import { v4 as uuidv4 } from 'uuid';

import swaggerJsDoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';

import { config } from './config.js';

// db instance
let sequelize;
let models = {};

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
        }
    });
}

async function createExpressApp() {
    console.info('creating Express app...');

    expressApp = express();
    expressApp.use(express.json());
    expressApp.use(cors(
        config.corsOptions
    ));

    /**
     * @swagger
     * /api/get-public-rooms-list:
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
    expressApp.get('/api/get-public-rooms-list', async (req, res) => {
        const rooms = await Room(sequelize).findAll({
            where: { public: true }
        })
        res.json(rooms);
    });

    /**
 * @swagger
 * /api/get-all-rooms-list:
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
    expressApp.get('/api/get-all-rooms-list', async (req, res) => {
        const rooms = await Room(sequelize).findAll({})
        res.json(rooms);
    });

    /**
     * @swagger
     * /api/generate-uuid:
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
    })

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

    const swaggerDocs = swaggerJsDoc(config.swaggerOptions);
    expressApp.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

async function runHttpsServer() {
    console.info('running HTTP server...');

    httpServer = http.createServer(expressApp);

    await new Promise((resolve) => {
        httpServer.listen(
            Number(config.http.listenPort), config.http.listenIp, resolve);
    });
    await sequelize.sync();
    console.info(`HTTP server listening on http://127.0.0.1:${config.http.listenPort}`);
}
