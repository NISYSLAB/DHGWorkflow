import React from 'react';
import './edgeDetails.css';
import ColorBox from './ColorBox';

const DefParentStyle = {
    height: '100px',
    minHeight: '100px',
    width: 'auto',
    background: 'aliceblue',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
};

const DefEdgeStyle = {
    border: 'none',
    width: '240px',
    height: '2px',
    backgroundColor: '#000',
    display: 'inline-block',
};

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
    data, setData, submit, nameAllowed,
}) => {
    const EdgeStyle = {
        ...DefEdgeStyle,
        backgroundColor: data.style['line-color'],
        height: data.style.width,
    };
    const ParentStyle = { ...DefParentStyle, height: data.style.height };
    const setStyle = (prop) => {
        setData({
            ...data,
            style:
            { ...data.style, ...prop },
        });
    };
    return (
        <div className="edgeform" onSubmit={submit}>
            <div style={ParentStyle}>
                <div style={EdgeStyle} />
                <Triangle size={data.style.width.slice(0, -2)} color={data.style['line-color']} />
                <div className="label">{data.name}</div>
            </div>
            <div className="form" style={{ padding: 20 }}>
                {nameAllowed ? <div> Label</div> : ''}
                {nameAllowed ? (
                    <input
                        className="edgeLabel"
                        type="text"
                        required
                        name="Edge Name"
                        value={data.name}
                        placeholder="Enter Edge Name"
                        onChange={(e) => setData({ ...data, name: `${e.target.value}` })}
                    />
                ) : ''}
                <div> Width</div>
                <input
                    type="number"
                    value={data.style.width.slice(0, -2)}
                    onChange={(e) => setStyle({ width: `${Math.max(0, Math.min(20, e.target.value))}px` })}
                />
                <div> Background Color</div>
                <ColorBox
                    color={data.style['line-color']}
                    setColor={(color) => setStyle({ 'line-color': color, 'target-arrow-color': color })}
                />
            </div>
        </div>
    );
};

export default EdgeDetails;
