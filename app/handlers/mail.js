import nodemailer from 'nodemailer';
import pug from 'pug';
import jucie from 'juice';
import { htmlToText } from 'html-to-text';
import util from 'util';
import {transportConfig } from '../config/mail.js';

const genHtml = (type, options = {}) => {
    let html = '';
    
    switch (type) {
        case 'reset-password':
            html = pug.renderFile(`./app/views/mail/reset-password.pug`, options);
            break;
        case 'account-activation':
            html = pug.renderFile('./app/views/mail/activation.pug', options);
            break;
    }
    
    return jucie(html);
}

const transport = nodemailer.createTransport(transportConfig);

export const SendEmail = (mailHead) => {
    const mailOptions = {
        from: 'UpTask <no-reply@uptask.com>',
        to: `${mailHead.email}`,
        subject: `${mailHead.subject}`,
        text: '',
        html: genHtml(mailHead.type, {url: mailHead.url})
    };
    return new Promise(async (resolve, reject) => {
        transport.sendMail(mailOptions).then(response => resolve(response)).catch(error => reject(error));
    });
}