const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const schema = require("./schema");
const dotenv = require("dotenv");

let main = async () => {
  dotenv.config();

  const app = express();
  const server = new ApolloServer({ schema });

  await server.start();
  server.applyMiddleware({ app });

  try {
    await mongoose.connect(process.env.MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(3000, () => {
      console.log("connected at 3000!");
    });
  } catch (e) {
    console.log(e);
  }
};

main();
