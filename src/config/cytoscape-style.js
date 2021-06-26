const style = [
    {
        selector: '*',
        style: {
            'overlay-opacity': '0',
        },
    },
    {
        selector: 'node[type = "ordin"]',
        style: {
            content: 'data(label)',
            'z-index': 100,
            width: 'data(style.width)',
            height: 'data(style.height)',
            shape: 'data(style.shape)',
            opacity: 'data(style.opacity)',
            'background-color': 'data(style.backgroundColor)',
            'border-color': 'data(style.borderColor)',
            'border-width': 'data(style.borderWidth)',
            'text-valign': 'center',
            'text-halign': 'center',
        },
    },
    {
        selector: 'node[type="special"]',
        style: {
            width: 8,
            height: 8,
            backgroundColor: 'red',
            'z-index': 1000,
        },
    },

    {
        selector: 'edge',
        style: {
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
        },
    },
    {
        selector: 'edge[type = "ordin"]',
        style: {
            width: 'data(style.thickness)',
            'line-color': 'data(style.backgroundColor)',
            'target-arrow-color': 'data(style.backgroundColor)',
            'curve-style': 'segments',
            'segment-distances': 'data(style.bendDistance)',
            'segment-weights': 'data(style.bendWeight)',
            'edge-distances': 'node-position',
        },
    },
    {
        selector: 'edge[label]',
        style: {
            label: 'data(label)',
            'edge-text-rotation': 'autorotate',
            'z-index': 999,
            'text-background-opacity': 1,
            color: '#000',
            'text-background-color': '#fff',
            'text-background-shape': 'roundrectangle',
            'text-border-color': '#fff',
            'text-border-width': 2,
            'text-border-opacity': 1,
        },
    },
    {
        selector: '.hidden',
        style: {
            display: 'none',
        },
    },
    {
        selector: '.eh-handle,node[type="bend"]',
        style: {
            height: 25,
            width: 25,
            opacity: 0.4,
            'border-width': 5,
            'border-opacity': 0.1,
        },
    },
    {
        selector: 'node[type="bend"]',
        style: {
            backgroundColor: '#9575cd',
        },
    },
    {
        selector: '.eh-handle',
        style: {
            'background-color': '#f50057',
        },
    },
    {
        selector: ':selected',
        style: {
            'overlay-color': '#000',
            'overlay-opacity': 0.1,
            'overlay-padding': 5,
        },
    },

];

export default style;
