import PropFromArr from './PropFromArr';

const parseNode = (node) => {
    const p = new PropFromArr(node).parseProps('data.y:ShapeNode', 2);
    return {
        label: p.parseProps('y:NodeLabel._') || p.parseProps('y:NodeLabel'),
        id: new PropFromArr(node).parseProps('$.id'),
        position: {
            x: parseFloat(p.parseProps('y:Geometry.$.x')),
            y: parseFloat(p.parseProps('y:Geometry.$.y')),
        },
        style: {
            width: parseFloat(p.parseProps('y:Geometry.$.width')),
            height: parseFloat(p.parseProps('y:Geometry.$.height')),
            opacity: parseInt(p.parseProps('y:Fill.$.opacity'), 10) || 1,
            shape: p.parseProps('y:Shape.$.type'),
            backgroundColor: p.parseProps('y:Fill.$.color'),
            borderColor: p.parseProps('y:BorderStyle.$.color'),
            borderWidth: parseInt(p.parseProps('y:BorderStyle.$.width'), 10),
        },
    };
};

const parseEdge = (edge) => ({
    label: new PropFromArr(edge).parseProps('data.*.y:EdgeLabel._')
             || new PropFromArr(edge).parseProps('data.*.y:EdgeLabel'),
    source: new PropFromArr(edge).parseProps('$.source'),
    target: new PropFromArr(edge).parseProps('$.target'),
    style: {
        backgroundColor: new PropFromArr(edge).parseProps('data.*.y:LineStyle.$.color'),
        thickness: parseFloat(new PropFromArr(edge).parseProps('data.*.y:LineStyle.$.width')),
    },
});

const parseDetails = (grahML) => grahML.parseProps('graphml.graph.$');

export { parseNode, parseEdge, parseDetails };
