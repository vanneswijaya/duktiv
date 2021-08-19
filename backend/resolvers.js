import { Project } from "./models.js";

const resolvers = {
  Query: {
    projects(parent, args, context, info) {
      return Project.find()
        .then((project) => {
          return project;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    project(parent, args, context, info) {
      return Project.findOne({ _id: args.id })
        .then((project) => {
          return project;
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};

export default resolvers;
