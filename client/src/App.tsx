import React from "react";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import ContinentList from "./components/Continent/ContinentList";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.REACT_APP_GRAPH_URI,
});

export default function App() {
  return (
    <ApolloProvider client={client}>
      <h1 className="p-4 flex flex-col items-center text-2xl">
        Countries dictionnary
      </h1>
      <ContinentList />
    </ApolloProvider>
  );
}
