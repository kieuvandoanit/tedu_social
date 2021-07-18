import { Route } from 'core/interfaces';
import express from 'express';
import mongoose from 'mongoose';

export default class App{
    public app:express.Application;
    public port:string|number;

    constructor(routes: Route[]){
        this.app = express();
        this.port = process.env.PORT||5000;

        this.initializeRoutes(routes);
        this.connectToDatabase();
    }

    public listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Server is listening on ${this.port}`);
        });
    }

    private initializeRoutes(routes:Route[]){
        routes.forEach((route) =>{
            this.app.use('/', route.router);
        });
    }

    private connectToDatabase(){
        try {
            mongoose.connect('mongodb://localhost/tedu_social',{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
            });
            console.log('database connected');
        } catch (error) {
            console.log('Connect to database error');
        }  
    }
}