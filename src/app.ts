import express, { Application } from "express";
import { postRouter } from "./modules/post/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";


const app:Application = express()


app.use(cors({
      origin: [
        "http://localhost:3000",   // frontend
        "http://localhost:3001",   // if you use another dev port
       process.env.APP_URL!
      ],
      credentials: true,   // REQUIRED for cookies & auth
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"]
    }));

app.all("/api/auth/*splat", toNodeHandler(auth));
 
app.use(express.json());

app.use("/posts", postRouter)


app.get('/',(req, res) => {
      res.send("Hello World!")
})


export default app;