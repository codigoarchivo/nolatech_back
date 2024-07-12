import express, { Application } from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import db from '../db/connection';
// routes
import routes_auth from '../routes/authRoutes'
import routes_user from '../routes/userRoutes'
import routes_upload from '../routes/uploadRoutes'

class Server {
  private app: Application;
  private port: string | undefined;
  private pathNames = {
    base: process.env.BASE || '/',
  };

  constructor() {
    // create app
    this.app = express();
    // create  port
    this.port = process.env.PORT || '8000';
    // db postgres Sequelize
    this.dbConnection();
    // create middlewarwes
    this.middlewares();
    // routes
    this.routes();
  }

  async dbConnection() {
    try {
      await db.authenticate();
      console.log('Online');
    } catch (error) {
      console.log(`Offline ${error}`);
    }
  }

  private middlewares() {
    // create cors
    this.app.use(cors());
    // create express json
    this.app.use(express.json());
    // create public file
    this.app.use(express.static('public'));
    // create uploads
    this.app.use(
      fileUpload({
        limits: { fileSize: 5000000 },
        useTempFiles: true,
        tempFileDir: '/tmp/',
      })
    );
  }

  private routes() {
    this.app.use(this.pathNames.base, routes_auth);
    this.app.use(this.pathNames.base, routes_user);
    this.app.use(this.pathNames.base, routes_upload);
  }

  public start() {
    this.app.listen(this.port, () =>
      console.log(`Server is running on port ${this.port}`)
    );
  }
}

export default Server;
