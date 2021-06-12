import Slider from 'rc-slider';
import React, { useState } from 'react';
import { BiReset, BiRectangle } from 'react-icons/bi';
import 'rc-slider/assets/index.css';
import './zoomSetter.css';
import GraphOption from '../config/cytoscape-options';

const { minZoom, maxZoom } = GraphOption;
const marks = {};

const ZoomComp = ({ superState }) => {
    const myGraph = superState.graphs[superState.curGraphIndex] && superState.graphs[superState.curGraphIndex].instance;
    if (!myGraph) return <></>;
    const [zoomValue, setZoomValue] = useState(myGraph.getZoom());
    myGraph.setOnZoom(setZoomValue);
    return (
        <div>
            <div className="zoom-comp">
                <div
                    role="button"
                    tabIndex={0}
                    className="zoom-box zoom-btn"
                    onClick={() => myGraph.resetZoom()}
                    onKeyDown={(ev) => ev.key === 13 && (myGraph.resetZoom())}
                >
                    <BiReset />

                </div>
                <div
                    role="button"
                    tabIndex={0}
                    className="zoom-box zoom-btn"
                    onClick={() => myGraph.fitZoom()}
                    onKeyDown={(ev) => ev.key === 13 && (myGraph.resetZoom())}
                >
                    <BiRectangle />

                </div>
                <div className="zoom-box zoom-value">
                    {zoomValue}
                    %
                </div>
                <div className="slider">
                    <Slider
                        min={100 * minZoom}
                        max={100 * maxZoom}
                        marks={marks}
                        onChange={
                            (value) => { myGraph.setZoom(value); setZoomValue(value); }
                        }
                        included={false}
                        value={zoomValue}
                    />
                </div>
            </div>
        </div>
    );
};

export default ZoomComp;
