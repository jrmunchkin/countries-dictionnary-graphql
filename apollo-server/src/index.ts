import { ApolloServer } from "apollo-server";
import dotenv from "dotenv";
import mongoose from "mongoose";
import typeDefs from "./schema/typeDefs";
import resolvers from "./schema/resolvers";
dotenv.config();

const MODE = process.env.MODE as string;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    environment: MODE,
  }),
});

if (MODE == "db") {
  const MONGO_URL = process.env.MONGO_URL as string;

  mongoose.connect(MONGO_URL);

  mongoose.connection.once("open", () => {
    console.log("connected to database");
  });
}

server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
