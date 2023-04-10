import express, { Express } from "express";
import dotenv from "dotenv";
import { graphqlHTTP } from "express-graphql";
import mongoose from "mongoose";
import schema from "./schema/schema";
import cors from "cors";
dotenv.config();

const MODE = process.env.MODE as string;

const app: Express = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

if (MODE == "db") {
  const MONGO_URL = process.env.MONGO_URL as string;

  mongoose.connect(MONGO_URL);

  mongoose.connection.once("open", () => {
    console.log("connected to database");
  });
}

app.use(
  "/",
  graphqlHTTP({
    schema,
    graphiql: true,
    context: {
      environment: MODE,
    },
  })
);

app.listen(process.env.PORT, () => {
  console.log(`🚀  Server ready at http://localhost:${process.env.PORT}/`);
});
