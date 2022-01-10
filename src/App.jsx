import Graph from "react-graph-vis";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { v4 as uuidv4 } from 'uuid'
import { useReadCypher, int } from "use-neo4j";
import _ from 'lodash';

const options = {
  layout: {
    hierarchical: false
  },
  edges: {
    color: "#000000"
  }
};

function randomColor() {
  const red = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const green = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const blue = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  return `#${red}${green}${blue}`;
}

const query = `MATCH (n1)-[r]->(n2) RETURN n1, r, n2 LIMIT 25`;

const App = () => {
  const { records, result } = useReadCypher(query);
  useEffect(() => {
    if (result) {
      const data = records.reduce((acc, el) => {
        const n1 = el.get('n1');
        const n2 = el.get('n2');
        const r = el.get('r');
        acc.edges.push({
          from: r.start,
          to: r.end,
          label: r.type
        });
        // { id, label: `Node ${id}`, color, x, y }
        if (!_.some(acc.nodes, el => el.id.equals(n1.identity) )) {
          acc.nodes.push({ id: n1.identity, label: n1.properties.name || n1.properties.title, color: randomColor(), ...n1.properties });
        }
        if (!_.some(acc.nodes, el => el.id.equals(n2.identity))) {
          console.log(n2);
          acc.nodes.push({ id: n2.identity, label: n2.properties.name || n2.properties.title, color: randomColor(), ...n2.properties });
        }
        return acc;
      }, { nodes: [], edges: [] });

      setState(prev => ({
        ...prev,
        graph: {
          nodes: data.nodes.map(el => ({...el, id: el.id.toString()})),
          edges: data.edges.map(el => ({...el, from: el.from.toString(), to: el.to.toString()})),
        }
      }))
    }
  }, [result, records]);

  const [state, setState] = useState({
    counter: 5,
    graph: {
      nodes: [],
      edges: []
    },
    events: {
      select: ({ nodes, edges }) => {
      },
      doubleClick: ({ pointer: { canvas } }) => {
      }
    }
  })
  const { graph, events } = state;
  return (
    <div>
      <Graph  graph={graph} options={options} events={events} style={{ height: "640px" }} />
    </div>
  );
}
export default App;
