import { Sequelize, DataTypes, Model } from 'sequelize';

export default class User extends Model { }

export function initUserModel(sequelize) {
    User.init({
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        username: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        passwordHash: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        registrationDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        dateModified: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'User'
    })
}



