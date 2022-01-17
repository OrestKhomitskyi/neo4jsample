import React from "react";
import { Route, Routes } from "react-router-dom";
import { createDriver, Neo4jProvider } from "use-neo4j";
import Graph from "./pages/graph";

const driver = createDriver("neo4j", "localhost", 7687);

const App = () => {
  return (
    <Routes>
      <Route
        path="/*"
        element={
          <Neo4jProvider driver={driver}>
            <Graph />
          </Neo4jProvider>
        }
      />
    </Routes>
  );
};
export default App;
