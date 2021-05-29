import React from 'react';
import './nodeDetails.css';
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

const DefNodeStyle = {
    border: '1px solid black',
    width: '100px',
    height: '50px',
    backgroundColor: '#888',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    whiteSpace: 'nowrap',
};

const NodeDetails = ({ data, setData, submit }) => {
    const NodeStyle = {
        ...DefNodeStyle,
        backgroundColor: data.style['background-color'],
        borderColor: data.style['border-color'],
        borderWidth: data.style['border-width'],
        textValign: data.style['text-valign'],
        textHalign: data.style['text-halign'],
        width: data.style.width,
        height: data.style.height,
        opacity: data.style.opacity,
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
        <div className="nodeform" onSubmit={submit}>
            <div style={ParentStyle}><div style={NodeStyle}>{data.name}</div></div>
            <div className="form" style={{ padding: 20 }}>

                <div> Label</div>
                <input
                    type="text"
                    required
                    name="Node Name"
                    value={data.name}
                    placeholder="Enter Node Name"
                    onChange={(e) => setData({ ...data, name: `${e.target.value}` })}
                />
                <div> Width</div>
                <input
                    type="number"
                    value={data.style.width.slice(0, -2)}
                    onChange={(e) => setStyle({ ...data.style, width: `${Math.min(500, e.target.value)}px` })}
                />

                <div> Height</div>
                <input
                    type="number"
                    value={data.style.height.slice(0, -2)}
                    onChange={(e) => setStyle({ ...data.style, height: `${Math.min(200, e.target.value)}px` })}
                />

                <div> Background Color</div>
                <ColorBox
                    color={data.style['background-color']}
                    setColor={(color) => setStyle({ ...data.style, 'background-color': color })}
                />

                <div> Border Color</div>
                <ColorBox
                    color={data.style['border-color']}
                    setColor={(color) => setStyle({ ...data.style, 'border-color': color })}
                />

                <div> Border Width</div>
                <input
                    type="number"
                    value={data.style['border-width'].slice(0, -2)}
                    onChange={(e) => setStyle({ ...data.style, 'border-width': `${Math.min(30, e.target.value)}px` })}
                />
                <div> Opacity</div>
                <input
                    type="number"
                    step=".01"
                    value={data.style.opacity}
                    onChange={(e) => setStyle({ ...data.style, opacity: Math.min(1, Math.max(0, e.target.value)) })}
                />
            </div>
        </div>
    );
};

export default NodeDetails;
