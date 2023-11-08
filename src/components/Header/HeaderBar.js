import React from 'react';
import {useLocation, Link} from "react-router-dom";
import './HeaderBar.css';

const HeaderBar = () => {
    const location = useLocation();
    const locationName = location.pathname.split("/")[1];

    return (
        <header>
            <div className="header-item-main">
                <Link to="/" className="header-item-main-link">
                    AI.Blaze
                </Link>
            </div>
            <div className="header-item">
                {locationName}
            </div>
        </header>
    );
};

export default HeaderBar;