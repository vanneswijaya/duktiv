<template>
  <div class="w-screen h-screen grid grid-cols-4">
    <div class="col-span-1 bg-biru flex flex-col text-white">
      <p class="text-6xl pl-10 pt-10 font-black">DUKTIV</p>
      <input
        class="mt-10 mx-10 h-12 px-5 text-2xl text-black rounded-xl"
        v-model="projectTitle"
      />
      <button
        @click="addProject(projectTitle)"
        class="rounded-xl hover:scale-110 transition duration-500 ease-in-out bg-birumuda text-xl mt-3 mx-10 h-12 font-extrabold text-black cursor-pointer"
      >
        ADD PROJECT
      </button>
      <div class="flex flex-col gap-y-5 mt-10">
        <div
          v-for="project in projects"
          :key="project.id"
          class="relative px-10 h-16 flex items-center"
          :class="['tab', { active: currentTab == project.id }]"
          @click="currentTab = project.id"
        >
          <p class="text-3xl">{{ project.title }}</p>
          <button
            @click="deleteProject(project.id)"
            class="absolute inset-y-0 right-0 p-2 cursor-pointer mr-10 bg-red-500 text-white my-2 rounded-xl"
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
    <div class="col-span-3 bg-krem">
      <input
        class="my-10 ml-10 h-12 px-5 text-2xl text-black rounded-xl"
        v-model="taskTitle"
      />
      <button
        @click="addTask(currentTab, taskTitle)"
        class="rounded-xl bg-birumuda text-xl ml-5 h-12 px-10 font-extrabold text-black cursor-pointer"
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
          class="absolute inset-y-0 right-0 p-2 cursor-pointer mr-10 bg-red-500 text-white my-2 rounded-xl"
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
  background: #5fa8d3;
}
</style>
