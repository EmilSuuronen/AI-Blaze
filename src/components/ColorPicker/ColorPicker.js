import React, { useState } from 'react';
import { SketchPicker } from 'react-color';

function ColorPicker({ color, onColorChange }) {
    const [pickerVisible, setPickerVisible] = useState(false);

    const togglePicker = () => {
        setPickerVisible(!pickerVisible);
    };

    const handleChangeComplete = (color) => {
        onColorChange(color.hex);
    };

    return (
        <div>
            {pickerVisible && (
                <SketchPicker color={color} onChangeComplete={handleChangeComplete} />
            )}
            <div
                style={{
                    marginTop: '20px',
                    width: '100%',
                    height: '50px',
                    backgroundColor: color,
                    color: getContrastYIQ(color), // To ensure text is readable on any color background
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    border: '1px solid black'
                }}
                onClick={togglePicker}
            >
                {color}
            </div>
        </div>
    );
}

function getContrastYIQ(hexcolor){
    hexcolor = hexcolor.replace("#", "");
    let r = parseInt(hexcolor.substr(0,2),16);
    let g = parseInt(hexcolor.substr(2,2),16);
    let b = parseInt(hexcolor.substr(4,2),16);
    let yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
}

export default ColorPicker;
