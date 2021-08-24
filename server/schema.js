const { Project, Task, Subtask } = require("./models");
const graphql = require("graphql");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    status: { type: GraphQLString },
    due: { type: GraphQLString },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve(parent, args) {
        return Task.find({ projectId: parent.id });
      },
    },
  }),
});

const TaskType = new GraphQLObjectType({
  name: "Task",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    status: { type: GraphQLString },
    due: { type: GraphQLString },
    project: {
      type: ProjectType,
      resolve(parent, args) {
        return Project.findbyId(parent.projectId);
      },
    },
    subtasks: {
      type: new GraphQLList(SubtaskType),
      resolve(parent, args) {
        return Subtask.find({ taskId: parent.id });
      },
    },
  }),
});

const SubtaskType = new GraphQLObjectType({
  name: "Subtask",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    status: { type: GraphQLString },
    due: { type: GraphQLString },
    task: {
      type: TaskType,
      resolve(parent, args) {
        return Project.findbyId(parent.taskId);
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return Project.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addProject: {
      type: ProjectType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: GraphQLString, defaultValue: "unmarked" },
        due: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return Project.create({
          title: args.title,
          status: args.status,
          due: args.due,
          tasks: [],
        });
      },
    },
    addTask: {
      type: TaskType,
      args: {
        projectId: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: GraphQLString, defaultValue: "unmarked" },
        due: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let task = new Task({
          projectId: args.projectId,
          title: args.title,
          status: args.status,
          due: args.due,
        });
        task.save();
        Project.updateOne({ id: args.projectId }, { $push: { tasks: task } });
      },
    },
    addSubtask: {
      type: SubtaskType,
      args: {
        taskId: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        status: { type: GraphQLString, defaultValue: "unmarked" },
        due: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let subtask = new Subtask({
          taskId: args.taskId,
          title: args.title,
          status: args.status,
          due: args.due,
        });
        subtask.save();
        Task.updateOne({ id: args.taskId }, { $push: { subtasks: subtask } });
      },
    },
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return Project.findByIdAndDelete(args.id);
      },
    },
    deleteTask: {
      type: TaskType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return Task.findByIdAndDelete(args.id);
      },
    },
    deleteSubtask: {
      type: SubtaskType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return Subtask.findByIdAndDelete(args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
