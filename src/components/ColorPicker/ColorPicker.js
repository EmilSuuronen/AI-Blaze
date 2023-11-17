import React, {useEffect, useRef, useState} from 'react';
import { ChromePicker } from 'react-color';

function ColorPicker({ color, onColorChange }) {
    const [pickerVisible, setPickerVisible] = useState(false);
    const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

    const colorPickerRef = useRef(null);

    useEffect(() => {
        // Function to call when clicking outside of color picker
        const handleClickOutside = (event) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
                setPickerVisible(false);
            }
        };
        // Add event listener when the color picker is visible
        if (pickerVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        // Cleanup
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [pickerVisible]); // Only re-run the effect if pickerVisible changes

    const togglePicker = () => {
        // eslint-disable-next-line no-restricted-globals
        const { clientX, clientY } = event;
        setClickPosition({ x: clientX, y: clientY });
        setPickerVisible(!pickerVisible);
    };

    const handleChangeComplete = (color) => {
        onColorChange(color.hex);
    };


    const pickerStyle = {
        position: 'absolute',
        left: `${clickPosition.x}px`,
        top: `${clickPosition.y}px`,
        zIndex: 1000
    };

    return (
        <div>
            {pickerVisible && (
                <div style={pickerStyle} ref={colorPickerRef} >
                    <ChromePicker color={color} onChangeComplete={handleChangeComplete} disableAlpha={true}/>
                </div>
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
