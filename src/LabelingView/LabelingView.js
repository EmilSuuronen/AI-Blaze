import React, {useRef, useEffect, useState} from 'react';
import {fabric} from 'fabric';
import LabelModalMenu from "../components/LabelModalMenu/LabelModal";
import {modalUIElements} from "../components/LabelModalMenu/LabelModalElements";
import "../components/LabelModalMenu/LabelModal.css";
import "./LabelingView.css";
import {Link} from "react-router-dom";
import { useNavigate } from 'react-router-dom';

// This component is the main view for the labeling page
export default function LabelingView() {

    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const [rectangles, setRectangles] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [currentRect, setCurrentRect] = useState(null);

    useEffect(() => {
        console.log("Code run, canvas created")
        setCanvas(new fabric.Canvas(canvasRef.current, {
            selection: false,
        }));
    }, []);

    // When the canvas is initialized, load the image and add event listeners
    useEffect(() => {
        if (canvas && canvasRef.current) {

            // Load the background image and resize the canvas to match the image
            fabric.Image.fromURL(localStorage.getItem('imageSrc'), (img) => {
                // Calculate the scale for the image
                const maxDimensions = {width: 600, height: 400};
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

            let rect, isDrawing = false, origX, origY;

            // When the user clicks the mouse, begin the drawing
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

            // While the user is dragging the mouse, update the rectangle's dimensions
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

            // When the user releases the mouse button, save the rectangle data
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
    };

    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/generate', { state: { objectData: rectangles } });
    };

    return (
        <div className="main-divider">
            <canvas ref={canvasRef}/>
            {showDropdown && (
                <LabelModalMenu
                    uiElements={modalUIElements}
                    onSelect={handleDropdownSelect}
                    onClose={() => setShowDropdown(false)}
                />
            )}
            <button onClick={handleNavigate}>Generate to code</button>
        </div>
    );
}

