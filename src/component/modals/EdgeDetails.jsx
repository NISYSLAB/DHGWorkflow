import React, { useCallback } from 'react';
import ColorBox from './ColorBox';
import './edgeDetails.css';

const Triangle = ({ size, color }) => {
    const s = parseInt(size, 10) * 5;
    const EqTriangle = {
        borderLeft: `${0.8666 * s}px solid ${color}`,
        borderBottom: `${s / 2}px solid transparent`,
        borderTop: `${s / 2}px solid transparent`,
        marginLeft: -1,
    };
    return (
        <div style={EqTriangle} />
    );
};

const EdgeDetails = ({
    data, setData, submit, labelAllowed,
}) => {
    const setStyle = (prop) => setData({ ...data, style: { ...data.style, ...prop } });
    const inputRef = useCallback((node) => node && node.focus(), []);

    return (
        <div className="edgeform" onSubmit={submit}>
            <div className="par-div">
                <div
                    className="edge-div"
                    style={{ ...data.style, height: data.style.thickness }}
                />
                <Triangle size={data.style.thickness} color={data.style.backgroundColor} />
                <div className="label">{data.label}</div>
            </div>
            <div className="form">
                {labelAllowed ? <div> Label</div> : ''}
                {labelAllowed ? (
                    <input
                        ref={inputRef}
                        className="edgeLabel"
                        type="text"
                        required
                        label="Edge Label"
                        value={data.label}
                        placeholder="Enter Edge Label"
                        onChange={(e) => setData({ ...data, label: `${e.target.value}` })}
                    />
                ) : ''}
                <div> Thickness</div>
                <input
                    type="number"
                    value={data.style.thickness}
                    onChange={(e) => setStyle({ thickness: Math.max(0, Math.min(20, e.target.value)) })}
                />
                <div> Background Color</div>
                <ColorBox
                    color={data.style.backgroundColor}
                    setColor={(color) => setStyle({ backgroundColor: color })}
                    type="dark"
                />
            </div>
        </div>
    );
};

export default EdgeDetails;
