import React, { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric'; // Ensure fabric is imported correctly

export default function DrawingTools({ imageSrc }) {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // Set the dimensions for the canvas
        const canvasElement = canvasRef.current;
        canvasElement.width = 200;  // Set the width of the canvas
        canvasElement.height = 400; // Set the height of the canvas

        // Initialize Fabric.js canvas
        const newCanvas = new fabric.Canvas(canvasElement, {
            selection: true,
        });

        // Set the canvas to the state
        setCanvas(newCanvas);

        // Add an event listener for mouse down to start drawing
        newCanvas.on('mouse:down', (o) => {
            const pointer = newCanvas.getPointer(o.e);
            setStartPoint(pointer);

            // Create a rectangle (with no dimensions yet)
            const rect = new fabric.Rect({
                left: pointer.x,
                top: pointer.y,
                width: 0,
                height: 0,
                fill: 'transparent',
                stroke: 'red',
                strokeWidth: 4,
            });

            newCanvas.add(rect);
            newCanvas.setActiveObject(rect);
        });

        // Add an event listener for mouse move to update the dimensions of the box
        newCanvas.on('mouse:move', (o) => {
            if (!newCanvas.getActiveObject()) {
                return;
            }
            const pointer = newCanvas.getPointer(o.e);
            const activeObject = newCanvas.getActiveObject();

            if (activeObject && activeObject.type === 'rect') {
                activeObject.set({
                    width: Math.abs(pointer.x - startPoint.x),
                    height: Math.abs(pointer.y - startPoint.y),
                    left: pointer.x < startPoint.x ? pointer.x : startPoint.x,
                    top: pointer.y < startPoint.y ? pointer.y : startPoint.y,
                });
                newCanvas.renderAll();
            }
        });

        // Add an event listener for mouse up to finalize the box
        newCanvas.on('mouse:up', () => {
            newCanvas.off('mouse:down');
            newCanvas.off('mouse:move');
        });

        // Load the background image
        fabric.Image.fromURL(imageSrc, (img) => {
            newCanvas.setBackgroundImage(img, newCanvas.renderAll.bind(newCanvas), {
                scaleX: newCanvas.width / img.width,
                scaleY: newCanvas.height / img.height,
            });
        });
    }, [imageSrc]);

    return (
        <div>
            <canvas ref={canvasRef} width="800" height="600"/>
        </div>
    );
}