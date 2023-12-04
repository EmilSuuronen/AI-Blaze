
const handleElementHoverChange = (iframeRef) => {
    const validTagNames = ['BUTTON', 'DIV', 'P', 'LABEL', 'SPAN', 'LI', 'INPUT', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
    const iframeDocument = iframeRef.current.contentDocument;
    let originalColor = '';
    let originalBackgroundColor = '';

    const initializeListeners = () => {
        if (iframeDocument) {
            validTagNames.forEach(tagName => {
                const elements = iframeDocument.getElementsByTagName(tagName);
                for (let i = 0; i < elements.length; i++) {
                    elements[i].addEventListener('mouseover', handleMouseOver);
                    elements[i].addEventListener('mouseout', handleMouseOut);
                }
            });
        }
    };

    const handleMouseOver = (event) => {
        const computedStyle = window.getComputedStyle(event.target);
        const originalColor = computedStyle.color;
        const originalBackGroundColor = computedStyle.backgroundColor;
        event.target.style.color = '#009dff';
        event.target.style.backgroundColor = 'rgba(0,0,0,0.5)';
    };

    const handleMouseOut = (event) => {
        event.target.style.color = originalColor;
        event.target.style.backgroundColor = originalBackgroundColor;
    };

    setTimeout(initializeListeners, 1000);
}

export default handleElementHoverChange;