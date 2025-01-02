import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { graphqlHTTP } from "express-graphql";
import BookSchema from "./schema/schema.js";

const port = process.env.PORT || 8080;

const app = express();
app.use(cors());  
app.use(express.json());

app.use("/api", graphqlHTTP({ schema: BookSchema, graphiql : true }));

const server = createServer(app);
server.listen(port);

server.on("listening", () =>
  console.log(`server is listening on port:${port}`)
);
server.on("error", () =>
  console.log(`server is not listening on port:${port}`)
);
