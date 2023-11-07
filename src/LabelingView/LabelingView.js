import React, {useRef, useEffect, useState} from 'react';
import {fabric} from 'fabric';
import LabelModalMenu from "../components/LabelModalMenu/LabelModal";
import {dropDownUIElements} from "../components/LabelModalMenu/LabelModalElements";
import "../components/LabelModalMenu/LabelModal.css";

export default function LabelingView() {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const [rectangles, setRectangles] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [currentRect, setCurrentRect] = useState(null);

    // Retrieve the image data from localStorage when the component mounts
    useEffect(() => {
        const storedImageSrc = localStorage.getItem('imageSrc');
        if (storedImageSrc) {
            setCanvas(new fabric.Canvas(canvasRef.current, {
                selection: false,
            }));
        }
    }, []);

    useEffect(() => {
        if (canvas && canvasRef.current) {
            let rect, isDrawing = false, origX, origY;

            const handleMouseDown = (o) => {
                if (canvas.getActiveObject()) {
                    return;
                }
                isDrawing = true;

                const pointer = canvas.getPointer(o.e);
                origX = pointer.x;
                origY = pointer.y;
                rect = new fabric.Rect({
                    left: origX,
                    top: origY,
                    originX: 'left',
                    originY: 'top',
                    width: pointer.x - origX,
                    height: pointer.y - origY,
                    fill: 'transparent',
                    stroke: 'red',
                    strokeWidth: 2,
                    selectable: true,
                });

                canvas.add(rect);
            };

            const handleMouseMove = (o) => {
                if (!isDrawing || canvas.getActiveObject()) {
                    return;
                }
                const pointer = canvas.getPointer(o.e);
                const width = Math.abs(origX - pointer.x);
                const height = Math.abs(origY - pointer.y);

                rect.set({
                    width: width,
                    height: height,
                    left: origX - (origX > pointer.x ? width : 0),
                    top: origY - (origY > pointer.y ? height : 0),
                });

                canvas.renderAll();
            };

            const handleMouseUp = (o) => {
                if (isDrawing) {
                    isDrawing = false;
                    const id = Date.now();

                    const rectData = {
                        id: id,
                        left: rect.left,
                        top: rect.top,
                        width: rect.width,
                        height: rect.height,
                        label: ''
                    };

                    setCurrentRect(rectData);
                    setShowDropdown(true);
                    setRectangles(prevRectangles => [...prevRectangles, rectData]);

                    rect.setCoords();
                }
            };

            // Register mouse event listeners
            canvas.on('mouse:down', handleMouseDown);
            canvas.on('mouse:move', handleMouseMove);
            canvas.on('mouse:up', handleMouseUp);

            // Load the background image and resize the canvas to match the image
            fabric.Image.fromURL(localStorage.getItem('imageSrc'), (img) => {
                // Calculate the scale for the image
                const maxDimensions = {width: 800, height: 600};
                const scale = Math.min(maxDimensions.width / img.width, maxDimensions.height / img.height, 1);

                // Apply scale to image and set it as the background image
                img.scale(scale);
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                    originX: 'left', originY: 'top',
                });

                // Set the canvas dimensions to the scaled image dimensions
                canvas.setWidth(img.getScaledWidth());
                canvas.setHeight(img.getScaledHeight());
                canvas.calcOffset(); // Recalculate the canvas dimensions and re-render the canvas

                // Re-render the canvas
                canvas.renderAll();
            });

            // Clean-up function to remove canvas event listeners when the component unmounts
            return () => {
                canvas.off('mouse:down', handleMouseDown);
                canvas.off('mouse:move', handleMouseMove);
                canvas.off('mouse:up', handleMouseUp);
            };
        }
    }, [canvas]);


    // Function to handle dropdown selection
    const handleDropdownSelect = (label) => {
        setCurrentRect((prevRect) => ({ ...prevRect, label }));
        setShowDropdown(false);
        setRectangles((prevRectangles) =>
            prevRectangles.map((r) => (r.id === currentRect.id ? { ...r, label } : r))
        );
        console.log("rectangles: " + JSON.stringify(rectangles, null, 2));
    };

    return (
        <div>
            <canvas ref={canvasRef} />
            {showDropdown && (
                <LabelModalMenu
                    uiElements={dropDownUIElements}
                    onSelect={handleDropdownSelect}
                    onClose={() => setShowDropdown(false)}
                />
            )}
        </div>
    );
}

