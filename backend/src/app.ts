import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// routers
import userRouter from "./domain/user/routes/user.routes";
import adminRouter from "./domain/admin/routes/admin.routes";
import companyRouter from "./domain/company/routes/company.routes";

dotenv.config();

const app: Application = express();
const corsOptions = {
  origin: "http://localhost:5173", // ✅ Must be the exact origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // ✅ Allow credentials (cookies)
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

//middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/", userRouter); //userrouter
app.use("/admin", adminRouter); //adminrouter
app.use("/company", companyRouter); //companyrouter

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({
    message: err.message || "something wrong",
  });
});

export default app;
