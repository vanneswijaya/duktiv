import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Project {
    _id: String
    title: String
    status: String
    tasks: [String]
  }

  type Query {
    projects: [Project]
    project(id: String): Project
  }

  type Mutation {
    addProject(title: String, status: String, tasks: [String]): Project
  }
`;

export default typeDefs;
