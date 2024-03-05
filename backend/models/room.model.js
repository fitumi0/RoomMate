import { Sequelize, DataTypes, Model } from 'sequelize';
import { config } from '../config.js';
const sequelize = new Sequelize(config.databaseOptions.connectionString);

export default class Room extends Model { }

export function initRoomModel(sequelize) {
    Room.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        public: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE, // TOFIX: почему-то устанавливается дата, вместо null по умолчанию
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        deletedAt: {
            type: DataTypes.DATE,
            defaultValue: null
        }
    }, {
        sequelize,
        modelName: 'Room'
    })
}



