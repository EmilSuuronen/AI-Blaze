import React, { useState } from 'react';
import { SketchPicker } from 'react-color';

function ColorPicker() {
    const [color, setColor] = useState('#fff');

    const handleChangeComplete = (color) => {
        setColor(color.hex);
    };

    return (
        <div>
            <SketchPicker color={color} onChangeComplete={handleChangeComplete} />
            <div style={{ marginTop: '20px', width: '100%', height: '50px', backgroundColor: color }}>
                {/* This div's background changes based on the selected color */}
            </div>
        </div>
    );
}

export default ColorPicker;