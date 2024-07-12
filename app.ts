import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import Server from './src/models/Server';

// config dotenv
dotenv.config();
// config cloudinary
cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  cloud_name: process.env.CLOUDINARY_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// new server
const server = new Server();
// server listen
server.start();
