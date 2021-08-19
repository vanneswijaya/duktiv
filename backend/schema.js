import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Project {
    _id: String
    title: String
    tasks: [String]
    status: String
  }

  type Query {
    projects: [Project]
    project(id: String): Project
  }
`;

export default typeDefs;
