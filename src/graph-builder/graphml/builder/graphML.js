const graphML = ({
  nodes, edges, id, projectName, author,
}) => ({
  graphml: {
    $: {
      xmlns: 'http://graphml.graphdrawing.org/xmlns',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xsi:schemaLocation': 'http://graphml.graphdrawing.org/xmlns http://www.yworks.com/xml/schema/graphml/1.1/ygraphml.xsd',
      'xmlns:y': 'http://www.yworks.com/xml/graphml',
    },
    key: [
      {
        $: {
          for: 'node',
          id: 'd6',
          'yfiles.type': 'nodegraphics',
        },
      },
      {
        $: {
          for: 'edge',
          id: 'd10',
          'yfiles.type': 'edgegraphics',
        },
      },
    ],
    graph: [
      {
        $: {
          edgedefault: 'directed',
          id,
          projectName,
          author,
        },
        node: nodes,
        edge: edges,
      },
    ],
  },
});

export default graphML;
