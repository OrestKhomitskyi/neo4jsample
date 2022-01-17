import React, { useCallback, useEffect, useState } from "react";
import { useReadCypher } from "use-neo4j";
import _ from "lodash";
import Graph from "react-graph-vis";
import { Button, Switch } from "antd";
import Text from "antd/lib/typography/Text";

const structure = ["Hospitl", "Doctor", "Patient", "HealthIssues", "Issue"];

const WHITE = "#ffffff";
const BLACK = "#000000";

const colors = {
  Hospitl: {
    color: {
      background: "#CEB992",
    },
    font: {
      color: BLACK,
    },
  },
  Doctor: {
    color: {
      background: "#73937E",
    },
    font: {
      color: WHITE,
    },
  },
  Patient: {
    color: {
      background: "#585563",
    },
    font: {
      color: WHITE,
    },
  },
  HealthIssues: {
    color: {
      background: "#5B2E48",
    },
    font: {
      color: WHITE,
    },
  },
  Issue: {
    color: {
      background: "#471323",
    },
    font: {
      color: WHITE,
    },
  },
};

const options = {
  layout: {
    improvedLayout: true,
    hierarchical: {
      enabled: true,
      direction: "UD",
      nodeSpacing: 180,
      levelSeparation: 100,
    },
  },
  edges: {
    color: "#000000",
  },
  physics: {
    enabled: false,
  },
  interaction: {
    selectConnectedEdges: false,
    selectable: true,
  },
};

const query = "MATCH (n1)-[r]->(n2) RETURN n1,r,n2";

const GraphCmp = () => {
  const [isDrillOn, setIsDrillOn] = useState(false);
  const { records, result } = useReadCypher(query);
  const [drillItemId, setDrillItemId] = useState(
    localStorage.getItem("drillItemId") || null
  );
  const [neo4jNodes, setNeo4jNodes] = useState([]);
  const handleRenderTree = useCallback(() => {
    const data = records.reduce(
      (acc, el) => {
        const item1 = el.get("n1");
        const { start, end, type } = el.get("r");
        const item2 = el.get("n2");
        acc.nodes.push({
          id: item1.identity,
          label: item1.properties.name,
          type: item1.labels[0],
          level: structure.indexOf(item1.labels[0]),
          ...colors[item1.labels[0]],
        });
        acc.nodes.push({
          id: item2.identity,
          label: item2.properties.name,
          type: item1.labels[0],
          level: structure.indexOf(item2.labels[0]),
          ...colors[item2.labels[0]],
        });
        acc.edges.push({
          from: start,
          to: end,
          label: type,
        });
        return acc;
      },
      { nodes: [], edges: [] }
    );

    data.nodes = _.chain(data.nodes)
      .uniqBy((el) => el.id.toString())
      .value();

    if (drillItemId && isDrillOn) {
      console.log(
        data.edges.map((el) => ({
          ...el,
          from: el.from.toString(),
          to: el.to.toString(),
        }))
      );
      const closestRels = _.filter(
        data.edges,
        (el) =>
          el.from.toString() === drillItemId || el.to.toString() === drillItemId
      );

      data.nodes = _.filter(data.nodes, (el) => {
        return _.some(
          closestRels,
          (cr) => cr.from.equals(el.id) || cr.to.equals(el.id)
        );
      });
    }

    setNeo4jNodes([...data.nodes]);
    setNodes(data.nodes.map((el) => ({ ...el, id: el.id.toString() })));
    setEdges(
      data.edges.map((el) => ({
        ...el,
        from: el.from.toString(),
        to: el.to.toString(),
      }))
    );
  }, [drillItemId, isDrillOn, records]);

  const selectNode = useCallback(
    ({ nodes }) => {
      setDrillItemId(nodes[0]);
      localStorage.setItem("drillItemId", nodes[0]);
      handleRenderTree();
    },
    [neo4jNodes, handleRenderTree]
  );
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const handleSwitchDrill = useCallback(
    (state) => {
      setIsDrillOn(state);
    },
    [setIsDrillOn, handleRenderTree]
  );

  useEffect(() => {
    if (result) {
      handleRenderTree();
    }
  }, [isDrillOn, result]);
  return (
    <div>
      <Text>Enable/Disable drilling</Text>
      <Switch checked={isDrillOn} onChange={handleSwitchDrill} />
      <br />
      <Text>
        Level:{" "}
        {
          structure[
            nodes.length &&
              nodes.find((el) => {
                return el.id === drillItemId;
              }).level
          ]
        }
      </Text>
      <Graph
        graph={{
          nodes,
          edges,
        }}
        options={options}
        events={{
          selectNode,
        }}
        style={{ height: "100vh" }}
      />
    </div>
  );
};

export default GraphCmp;
