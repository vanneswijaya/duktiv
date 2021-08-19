const { Project } = require("./models");

const resolvers = {
  Query: {
    projects(parent, args, context, info) {
      return Project.find();
    },
    project(parent, args, context, info) {
      return Project.findOne({ _id: args.id });
    },
  },
  Mutation: {
    addProject(parent, args, context, info) {
      const projectObj = new Project(args);
      return projectObj.save();
    },
  },
};

module.exports = resolvers;
