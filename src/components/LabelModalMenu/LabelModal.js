import React from 'react';

const LabelModalMenu = ({ uiElements, onSelect, onClose }) => {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                {uiElements.map((group, index) => (
                    <React.Fragment key={index}>
                        <div className="modal-title">{group.title}</div>
                        {group.data.map((item) => (
                            <button
                                key={item}
                                className="modal-item"
                                onClick={() => onSelect(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default LabelModalMenu;