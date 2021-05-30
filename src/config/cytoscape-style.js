import { NodeStyle, EdgeStyle } from './defaultStyles';

const style = [
    {
        selector: 'node[type = "ordin"]',
        style: {
            content: 'data(label)',
            ...NodeStyle,
        },
    },

    {
        selector: 'edge',
        style: {
            'curve-style': 'bezier',
            ...EdgeStyle,
        },
    },
    {
        selector: 'edge[label]',
        style: {
            label: 'data(label)',
            width: 3,
            'edge-text-rotation': 'autorotate',
            'text-margin-y': '10px',
        },
    },
    {
        selector: '.eh-handle',
        style: {
            'background-color': '#f00',
            height: 20,
            width: 20,
            opacity: 0.5,
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
