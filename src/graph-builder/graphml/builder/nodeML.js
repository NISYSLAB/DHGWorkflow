const nodeML = ({
  label, id, posX, posY, width, height, opacity, shape, backgroundColor, borderColor, borderWidth,
}) => ({
  $: {
    id,
  },
  data: [
    {
      $: {
        key: 'd6',
      },
      'y:ShapeNode': [
        {
          'y:Geometry': [
            {
              $: {
                height,
                width,
                x: posX,
                y: posY,
              },
            },
          ],
          'y:Fill': [
            {
              $: {
                color: backgroundColor,
                opacity,
              },
            },
          ],
          'y:BorderStyle': [
            {
              $: {
                color: borderColor,
                width: borderWidth,
              },
            },
          ],
          'y:NodeLabel': [label],
          'y:Shape': [
            {
              $: {
                type: shape,
              },
            },
          ],
        },
      ],
    },
  ],
});

export default nodeML;
