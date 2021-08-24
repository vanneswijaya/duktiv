<template>
  <div class="w-screen h-screen bg-yellow-300 flex flex-col items-center">
    <p class="text-5xl">DUKTIV</p>
    <div class="flex flex-col gap-y-10">
      <input v-model="title" />
      <input v-model="due" />
      <input v-model="status" />
      <button @click="addProject({ title: title, due: due, status: status })">
        ADD PROJECT
      </button>
    </div>
    <ul>
      <li v-for="project in projects" :key="project.id">
        <p class="text-3xl">{{ project.title }}</p>
        <button>DELETE</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useQuery, useResult, useMutation } from "@vue/apollo-composable";
import queryProjects from "../graphql/projects.query.gql";
import addProjectMutation from "../graphql/addProject.mutation.gql";
import deleteProjectMutation from "../graphql/deleteProject.mutation.gql";

const title = ref(null);
const due = ref(null);
const status = ref(null);

const { result } = useQuery(queryProjects);
const projects = useResult(result, null, (data) => data.projects);

const { mutate: addProject } = useMutation(addProjectMutation);
const { mutate: deleteProject } = useMutation(deleteProjectMutation);
</script>
