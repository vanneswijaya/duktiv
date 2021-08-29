<template>
  <div class="w-screen h-screen grid grid-cols-4">
    <div class="col-span-1 bg-yellow-300 flex flex-col">
      <p class="text-5xl pl-10 pt-10">DUKTIV</p>
      <input class="mt-5 mx-10" v-model="projectTitle" />
      <button
        @click="addProject(projectTitle)"
        class="border-2 border-black mt-3 mx-10 cursor-pointer"
      >
        ADD PROJECT
      </button>
      <div class="flex flex-col gap-y-5 mt-5">
        <div
          v-for="project in projects"
          :key="project.id"
          class="relative px-10 hover:bg-white h-16 flex items-center"
          :class="['tab', { active: currentTab == project.id }]"
          @click="currentTab = project.id"
        >
          <p class="text-3xl">{{ project.title }}</p>
          <button
            @click="deleteProject(project.id)"
            class="absolute inset-y-0 right-0 p-2 cursor-pointer mr-10 bg-red-500 text-white my-2"
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
    <div class="col-span-3 bg-green-300">
      <input class="mt-5 mx-10" v-model="taskTitle" />
      <button
        @click="addTask(currentTab, taskTitle)"
        class="border-2 border-black mt-3 mx-10 cursor-pointer"
      >
        ADD TASK
      </button>
      <div
        v-for="task in tasks"
        :key="task.id"
        class="relative px-10 h-16 flex items-center"
      >
        <p class="text-3xl">{{ task.title }}</p>
        <button
          @click="deleteTask(task.id)"
          class="absolute inset-y-0 right-0 p-2 cursor-pointer mr-10 bg-red-500 text-white my-2"
        >
          DELETE
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useQuery, useResult, useMutation } from "@vue/apollo-composable";
import queryProjects from "../graphql/projects.query.gql";
import queryTasks from "../graphql/tasks.query.gql";
import addProjectMutation from "../graphql/addProject.mutation.gql";
import addTaskMutation from "../graphql/addTask.mutation.gql";
import deleteProjectMutation from "../graphql/deleteProject.mutation.gql";
import deleteTaskMutation from "../graphql/deleteTask.mutation.gql";

const currentTab = ref(null);
const projectTitle = ref(null);
const taskTitle = ref(null);

const { result: projectResult } = useQuery(queryProjects);
const projects = useResult(projectResult, null, (data) => data.projects);

const { result: taskResult } = useQuery(queryTasks);
const tasks = useResult(taskResult, null, (data) =>
  data.tasks.filter((task) => task.project.id == currentTab.value)
);

const { mutate: addProjectGQL } = useMutation(addProjectMutation);

function addProject(title) {
  projectTitle.value = null;
  addProjectGQL(
    { title: title },
    {
      update: (cache, { data: { addProject } }) => {
        const data = cache.readQuery({ query: queryProjects });
        const updated = JSON.parse(JSON.stringify(data));
        updated.projects.push(addProject);
        cache.writeQuery({ query: queryProjects, data: { projects: updated } });
      },
    }
  );
}

const { mutate: addTaskGQL } = useMutation(addTaskMutation);

function addTask(projectId, title) {
  taskTitle.value = null;
  addTaskGQL(
    { projectId: projectId, title: title },
    {
      update: (cache, { data: { addTask } }) => {
        const data = cache.readQuery({ query: queryTasks });
        const updated = JSON.parse(JSON.stringify(data));
        updated.tasks.push(addTask);
        cache.writeQuery({ query: queryTasks, data: { tasks: updated } });
      },
    }
  );
}

const { mutate: deleteProjectGQL } = useMutation(deleteProjectMutation);

function deleteProject(id) {
  deleteProjectGQL(
    { id: id },
    {
      update: (cache, {}) => {
        const data = cache.readQuery({ query: queryProjects });
        const updated = JSON.parse(JSON.stringify(data));
        const final = updated.projects.filter((project) => project.id != id);
        cache.writeQuery({ query: queryProjects, data: { projects: final } });
      },
    }
  );
}

const { mutate: deleteTaskGQL } = useMutation(deleteTaskMutation);

function deleteTask(id) {
  deleteTaskGQL(
    { id: id },
    {
      update: (cache, {}) => {
        const data = cache.readQuery({ query: queryTasks });
        const updated = JSON.parse(JSON.stringify(data));
        const final = updated.tasks.filter((task) => task.id != id);
        cache.writeQuery({ query: queryTasks, data: { tasks: final } });
      },
    }
  );
}
</script>

<style scoped>
.tab.active {
  background: #fff;
}
</style>
