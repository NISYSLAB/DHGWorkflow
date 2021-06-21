const edgeML = ({
  id, label, source, target, lineColor, lineWidth,
}) => ({
  $: {
    id,
    source,
    target,
  },
  data: [
    {
      $: {
        key: 'd10',
      },
      'y:GenericEdge': [
        {
          $: {
            configuration: 'com.yworks.bpmn.Connection',
          },
          'y:LineStyle': [
            {
              $: {
                color: lineColor,
                width: lineWidth,
              },
            },
          ],
          'y:Arrows': [
            {
              $: {
                source: 'none',
                target: 'delta',
              },
            },
          ],
          'y:EdgeLabel': [label],
        },
      ],
    },
  ],
});

export default edgeML;
