import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import jwt from './jwt';

dotenv.config();

const mailer = async (email: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD,
      },
    });

    const token = jwt.signToken({ email, expiresIn: '1h' });

    const link = `${process.env.LINK_EMAIL}/activation/${token}`;

    const mailOptions = {
      from: process.env.MAILER_EMAIL,
      to: email,
      subject: 'Verification code',
      text: 'This is a code to log in:',
      html: `
        <p>You are almost ready to access. Click the link below to validate your email:</p>
        <a href='${link}' target='_blank'>${link}</a>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      isError: `Error sending email: ${(error as { message: string }).message}`,
    };
  }
};

export default mailer;
