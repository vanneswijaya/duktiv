<template>
  <div class="w-screen h-full flex flex-col items-center">
    <p class="text-5xl">DUKTIV</p>
    <ul>
      <li v-for="project in projects" :key="project.id">
        <p class="text-3xl">{{ project.title }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useQuery, useResult, useMutation } from "@vue/apollo-composable";
import queryProjects from "../graphql/projects.query.gql";
import addProject from "../graphql/addProject.mutation.gql";
import deleteProject from "../graphql/deleteProject.mutation.gql";

const { result } = useQuery(queryProjects);
const projects = useResult(result, null, (data) => data.projects);
</script>
