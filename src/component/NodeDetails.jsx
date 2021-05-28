import React from 'react';
import './nodeDetails.css';
import { TwitterPicker } from 'react-color';

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

const ColorBox = ({ color, setColor }) => {
    const [visible, setVisible] = React.useState(false);
    return (
        // eslint-disable-next-line
        <div className="color-box-par" onClick={() => !visible && setVisible(true)}>
            <div className="color-box" style={{ background: color }} />
            <div
                className="color-picker"
                style={{

                    display: visible ? 'block' : 'none',
                }}
            >
                {/* eslint-disable-next-line */}
                <div role="button" className="overlay" onClick={() => setVisible(false)}></div>
                <TwitterPicker color={color} onChangeComplete={(x) => setColor(x.hex)} />
            </div>
        </div>
    );
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
                    onChange={(e) => setData({
                        ...data,
                        style:
                { ...data.style, width: `${Math.min(500, e.target.value)}px` },
                    })}
                />

                <div> Height</div>
                <input
                    type="number"
                    value={data.style.height.slice(0, -2)}
                    onChange={(e) => setData({
                        ...data,
                        style:
                { ...data.style, height: `${Math.min(200, e.target.value)}px` },
                    })}
                />

                <div> Background Color</div>
                <ColorBox
                    color={data.style['background-color']}
                    setColor={(color) => setData({
                        ...data,
                        style:
                        { ...data.style, 'background-color': color },
                    })}
                />

                <div> Border Color</div>
                <ColorBox
                    color={data.style['border-color']}
                    setColor={(color) => setData({
                        ...data,
                        style:
                        { ...data.style, 'border-color': color },
                    })}
                />

                <div> Border Width</div>
                <input
                    type="number"
                    value={data.style['border-width'].slice(0, -2)}
                    onChange={(e) => setData({
                        ...data,
                        style:
                { ...data.style, 'border-width': `${Math.min(30, e.target.value)}px` },
                    })}
                />
                <div> Opacity</div>
                <input
                    type="number"
                    step=".01"
                    value={data.style.opacity}
                    onChange={(e) => setData({
                        ...data,
                        style:
                        { ...data.style, opacity: Math.min(1, Math.max(0, e.target.value)) },
                    })}
                />
            </div>
        </div>
    );
};

// return (
//         <div className="nodeform" onSubmit={submit}>
//             <div style={ParentStyle}><div style={NodeStyle}>{data.name}</div></div>
//             <div className="form" style={{ padding: 20 }}>
//
//                     <div> Label</div>
//                     <input
//                         value={data.name}
//                         placeholder="Enter Node Name"
//                         onChange={(e) => setData({ ...data, name: `${e.target.value}` })}
//                     />
//                 </div>
//                 <br />
//                 {/* <fieldset>
//                 <legend>Dimensions</legend> */}
//
//                     <div> Width</div>
//                     <input
//                         type="number"
//                         value={data.style.width.slice(0, -2)}
//                         onChange={(e) => setData({
//                             ...data,
//                             style:
//                 { ...data.style, width: `${Math.min(500, e.target.value)}px` },
//                         })}
//                     />
//                 </div>

//
//                     <div> Height</div>
//                     <input
//                         type="number"
//                         value={data.style.height.slice(0, -2)}
//                         onChange={(e) => setData({
//                             ...data,
//                             style:
//                 { ...data.style, height: `${Math.min(200, e.target.value)}px` },
//                         })}
//                     />
//                 </div>
//                 <br />
//                 {/* </fieldset> */}

//
//                     <div> Background Color</div>
//                     <input
//                         value={data.style['background-color'].slice(1)}
//                         onChange={(e) => setData({
//                             ...data,
//                             style:
//                 { ...data.style, 'background-color': `#${e.target.value}` },
//                         })}
//                     />

//                 </div>
//                 {/* <br /> */}

//
//                     <div> Border Color</div>
//                     <input
//                         value={data.style['border-color'].slice(1)}
//                         onChange={(e) => setData({
//                             ...data,
//                             style:
//                 { ...data.style, 'border-color': `#${e.target.value}` },
//                         })}
//                     />
//                 </div>

//
//                     <div> Border Width</div>
//                     <input
//                         type="number"
//                         value={data.style['border-width'].slice(0, -2)}
//                         onChange={(e) => setData({
//                             ...data,
//                             style:
//                 { ...data.style, 'border-width': `${Math.min(30, e.target.value)}px` },
//                         })}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

export default NodeDetails;
