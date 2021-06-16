import React from 'react';
import { TwitterPicker } from 'react-color';

const ColorBox = ({ color, setColor }) => {
    const [visible, setVisible] = React.useState(false);
    return (
        <div
            role="button"
            tabIndex={0}
            className="color-box-par"
            onClick={() => !visible && setVisible(true)}
            onKeyDown={(ev) => ev.key === ' ' && (!visible && setVisible(true))}
        >
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

export default ColorBox;
