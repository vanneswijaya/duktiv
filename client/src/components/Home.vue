<template>
  <div class="w-screen h-screen bg-yellow-300 flex flex-col items-center">
    <p class="text-5xl">DUKTIV</p>
    <div class="flex flex-col gap-y-10">
      <input v-model="title" />
      <input v-model="due" />
      <input v-model="status" />
      <button
        @click="addProject(title, due, status)"
        class="border-2 border-black"
      >
        ADD PROJECT
      </button>
    </div>
    <ul>
      <li v-for="project in projects" :key="project.id">
        <p class="text-3xl">{{ project.title }}</p>
        <button
          @click="deleteProject(project.id)"
          class="border-2 border-black"
        >
          DELETE
        </button>
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

const { mutate: addProjectGQL } = useMutation(addProjectMutation);
const { mutate: deleteProjectGQL } = useMutation(deleteProjectMutation);

function addProject(title, due, status) {
  addProjectGQL(
    { title: title, due: due, status: status },
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
</script>
