import express, { Application,Request,Response,NextFunction} from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser'
// routers
import userRouter from './domain/user/routes/user.routes'

dotenv.config();

const app:Application=express();


//middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan("dev"));
app.use(cookieParser())
app.use('/',userRouter);//userrouter
app.get('/',(_req:Request,res:Response) => {
    res.status(200).json({
        message:'api running successfully'
    })
})
app.use((err:Error,_req:Request,res:Response,_next:NextFunction) => {
    res.status(500).json({
        message:err.message || 'something wrong'
    })
})

export default app;