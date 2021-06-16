import React, { useCallback } from 'react';
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

const NodeDetails = ({
    data, setData, submit, labelAllowed,
}) => {
    const inputRef = useCallback((node) => node && node.focus(), []);
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
        borderRadius: data.style.shape === 'ellipse' ? '100%' : 0,
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
            <div style={ParentStyle}><div style={NodeStyle}>{labelAllowed ? data.label : ''}</div></div>
            <div className="form" style={{ padding: 20 }}>
                <div> Shape</div>
                <div>
                    <label htmlFor="rectangle">
                        <input
                            type="radio"
                            name="shape"
                            value="rectangle"
                            checked={data.style.shape === 'rectangle'}
                            onChange={() => setStyle({ shape: 'rectangle' })}
                        />
                        Rectangle
                    </label>
                </div>
                <div>
                    <label htmlFor="ellipse">
                        <input
                            type="radio"
                            name="shape"
                            value="ellipse"
                            checked={data.style.shape === 'ellipse'}
                            onChange={() => setStyle({ shape: 'ellipse' })}
                        />
                        Ellipse
                    </label>
                </div>
                <div />

                {labelAllowed ? <div> Label</div> : ''}
                {labelAllowed ? (
                    <input
                        className="nodeLabel"
                        ref={inputRef}
                        type="text"
                        required
                        label="Node Label"
                        value={data.label}
                        placeholder="Enter Node Label"
                        onChange={(e) => setData({ ...data, label: `${e.target.value}` })}
                    />
                ) : ''}
                <div> Width</div>
                <input
                    type="number"
                    value={data.style.width.slice(0, -2)}
                    onChange={(e) => setStyle({ width: `${Math.min(500, e.target.value)}px` })}
                />

                <div> Height</div>
                <input
                    type="number"
                    value={data.style.height.slice(0, -2)}
                    onChange={(e) => setStyle({ height: `${Math.min(200, e.target.value)}px` })}
                />

                <div> Background Color</div>
                <ColorBox
                    color={data.style['background-color']}
                    setColor={(color) => setStyle({ 'background-color': color })}
                />

                <div> Border Color</div>
                <ColorBox
                    color={data.style['border-color']}
                    setColor={(color) => setStyle({ 'border-color': color })}
                />

                <div> Border Width</div>
                <input
                    type="number"
                    value={data.style['border-width'].slice(0, -2)}
                    onChange={(e) => setStyle({ 'border-width': `${Math.min(30, e.target.value)}px` })}
                />
                <div> Opacity</div>
                <input
                    type="number"
                    step=".01"
                    value={data.style.opacity}
                    onChange={(e) => setStyle({ opacity: Math.min(1, Math.max(0, e.target.value)) })}
                />
            </div>
        </div>
    );
};

export default NodeDetails;
