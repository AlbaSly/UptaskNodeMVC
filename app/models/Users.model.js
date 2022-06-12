import sequelize from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

import crypto from 'crypto';
import bcrypt from 'bcrypt';

import { DB } from "../config/connection.js";
import { SendEmail } from "../handlers/mail.js";

export const UsersModel = DB.define('users', {
    id_user: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: sequelize.STRING
    },
    password: sequelize.STRING,
    active: {
        type: sequelize.INTEGER,
        defaultValue: 0
    },
    activationToken: sequelize.STRING,
    recoverToken: sequelize.STRING,
    tokenExp: sequelize.STRING
},{
    hooks: {
        async beforeCreate(user) {
            const activationToken = crypto.randomBytes(20).toString('hex');

            user.activationToken = activationToken;
            user.password = await bcrypt.hash(user.password, bcrypt.genSaltSync(5));

            await SendEmail({
                email: user.email,
                subject: 'Account Activation',
                type: 'account-activation',
                url: `${process.env.FULL_HOST_PORT}/auth/activation/${activationToken}`,
            });
        },
        async beforeUpdate(user) {
            if (user.activationToken) {
                const activationToken = crypto.randomBytes(20).toString('hex');

                await SendEmail({
                    email: user.email,
                    subject: 'Account Activation',
                    type: 'account-activation',
                    url: `${process.env.FULL_HOST_PORT}/auth/activation/${activationToken}`
                });

                user.activationToken = activationToken;
                user.password = await bcrypt.hash(user.password, bcrypt.genSaltSync(5));
            }
        }
    }
}
);