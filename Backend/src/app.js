import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.routes.js";
import interviewRouter from "./routes/interview.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

/* using all the routes here */
app.get("/home", (req, res) => {
  res.json({
    msg: "You are currently in the home page of the YouTube GenAI project!",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

export default app;



