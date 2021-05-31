import Slider from 'rc-slider';
import React from 'react';
import { BiReset, BiRectangle } from 'react-icons/bi';
import { actionType as T } from '../reducer';
import cyFun from '../graph-builder';
import 'rc-slider/assets/index.css';
import './zoomSetter.css';
import GraphOption from '../config/cytoscape-options';

const { minZoom, maxZoom } = GraphOption;
const marks = {};

const ZoomComp = ({ dispatcher, superState }) => (
    <div>
        <div className="zoom-comp">
            <div
                role="button"
                tabIndex={0}
                className="zoom-box zoom-btn"
                onClick={() => cyFun.resetZoom()}
                onKeyDown={(ev) => ev.key === 13 && (cyFun.resetZoom())}
            >
                <BiReset />

            </div>
            <div
                role="button"
                tabIndex={0}
                className="zoom-box zoom-btn"
                onClick={() => cyFun.fitZoom()}
                onKeyDown={(ev) => ev.key === 13 && (cyFun.resetZoom())}
            >
                <BiRectangle />

            </div>
            <div className="zoom-box zoom-value">
                {superState.zoomValue}
                %
            </div>
            <div className="slider">
                <Slider
                    min={100 * minZoom}
                    max={100 * maxZoom}
                    marks={marks}
                    onChange={(value) => { cyFun.setZoom(value); dispatcher({ type: T.SET_ZOOM, payload: value }); }}
                    included={false}
                    value={superState.zoomValue}
                />
            </div>
        </div>
    </div>
);

export default ZoomComp;
