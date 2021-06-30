import React from 'react';
import { TwitterPicker } from 'react-color';

const colors = {
    light: [
        '#FFCC00', '#ea80fc', '#ff4081', '#ff5252', '#82b1ff', '#b388ff', '#64ffda', '#40c4ff', '#90a4ae', '#a1887f',
    ],
    dark: [
        '#000000', '#f44336', '#9c27b0', '#7c4dff', '#1565c0', '#009688', '#ff6d00', '#827717', '#607d8b', '#000000',
    ],
};

const ColorBox = ({ color, setColor, type }) => {
    const [visible, setVisible] = React.useState(false);
    React.useEffect(() => {
        if (!color) setColor(colors[type][Math.floor(Math.random() * 10)]);
    }, []);
    return (
        <div
            role="button"
            tabIndex={0}
            className="color-box-par"
            onClick={() => !visible && setVisible(true)}
            onKeyDown={(ev) => ev.key === ' ' && (!visible && setVisible(true))}
        >
            <div className="color-box" style={{ background: color || '#000' }} />
            <div
                className="color-picker"
                style={{
                    display: visible ? 'block' : 'none',
                }}
            >
                {/* eslint-disable-next-line */}
                <div role="button" className="overlay" onClick={() => setVisible(false)}></div>
                <TwitterPicker
                    colors={colors[type]}
                    color={color || '#000'}
                    onChangeComplete={(x) => setColor(x.hex)}
                />
            </div>
        </div>
    );
};

export default ColorBox;
