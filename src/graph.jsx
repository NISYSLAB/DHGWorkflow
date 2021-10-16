import React, { } from 'react';

const Graph = ({ superState, el, i }) => (
    <div
        style={{ zIndex: 1, display: superState.curGraphIndex === i ? 'block' : 'none' }}
        id={el.id}
        key={el.id}
        className="graph-element"
    />
);
export default Graph;
