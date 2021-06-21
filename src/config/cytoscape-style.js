// import { NodeStyle, EdgeStyle } from './defaultStyles';

const style = [
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
            width: 8,
            height: 8,
            backgroundColor: 'red',
            'z-index': 1000,
        },
    },
    {
        selector: ':selected',
        style: {
            'overlay-color': '#000',
            'overlay-opacity': 0.1,
        },
    },

];

export default style;
