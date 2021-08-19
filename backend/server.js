import express from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import typeDefs from "./schema.js";
import resolvers from "./resolvers.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

await server.start();
server.applyMiddleware({ app });

mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => {
    app.listen(3000, () => {
      console.log("connected at 3000!");
    });
  })
  .catch((err) => {
    console.error("Error while connecting to MongoDB", err);
  });
