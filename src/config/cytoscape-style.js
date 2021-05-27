const style = [
    {
        selector: 'node[type = "ordin"]',
        style: {
            width: 100,
            height: 50,
            shape: 'rectangle',
            content: 'data(name)',
            'background-color': '#fff',
            'border-color': '#000',
            'border-width': 3,
            'text-valign': 'center',
            'text-halign': 'center',
        },
    },
    {
        selector: 'edge',
        style: {
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'border-color': '#000',
            'background-color': '#fff',
            width: 4,
            'line-color': '#000',
            'target-arrow-color': '#000',
        },
    },
    {
        selector: '.eh-handle',
        style: {
            'background-color': '#f00',
            height: 15,
            width: 15,
        },
    },
    {
        selector: 'node[type="special"]',
        style: {
            width: 10,
            height: 10,
            backgroundColor: 'red',
        },
    },

    // {
    //     selector: '.eh-ghost-edge',
    //     style: {
    //         'background-color': 'rgba(0,255,255,0.5)',
    //         'line-color': '#0f0',
    //         'target-arrow-color': '#0f0',
    //     },
    // },
];

export default style;
