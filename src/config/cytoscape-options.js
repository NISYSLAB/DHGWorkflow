import style from './cytoscape-style';

const options = {
    style: [...style],
    zoomingEnabled: true,
    userZoomingEnabled: true,
    minZoom: 0.25,
    maxZoom: 5,
};

export default options;
