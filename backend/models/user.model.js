import DataTypes from 'sequelize';

export default (sequelize) => {
    const User = sequelize.define('User', {
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
    });

    return User;
}