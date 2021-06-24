const edgeML = ({
  id, label, source, target, lineColor, lineWidth, bendPoint,
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
          'y:Path': [
            {
              $: {
                sx: '0.0',
                sy: '0.0',
                tx: '0.0',
                ty: '0.0',
              },
              'y:Point': [
                { $: bendPoint },
              ],
            },
          ],
        },
      ],
    },
  ],
});

export default edgeML;
