import { createApp, provide, h } from "vue";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { DefaultApolloClient } from "@vue/apollo-composable";
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css";

const defaultClient = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  cache: new InMemoryCache(),
});

// const query = gql`
//   query {
//     projects {
//       title
//       due
//       status
//     }
//   }
// `;

// defaultClient
//   .query({
//     query,
//   })
//   .then((res) => console.log(res));

createApp({
  setup() {
    provide(DefaultApolloClient, defaultClient);
  },
  render() {
    return h(App);
  },
})
  .use(router)
  .mount("#app");
