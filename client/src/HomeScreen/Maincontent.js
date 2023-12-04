// MainContent.js
import React, {useEffect, useState} from "react";
import "./MainContent.css";
import {useNavigate} from "react-router-dom";
import {Link} from "@mui/material";

function MainContent({imageUrls}) {
    const [latestProjects, setLatestProjects] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        setLatestProjects(imageUrls.slice(0, 3));
    }, [imageUrls]);

    const handleNavigateToGenerateView = (contentData) => {
        console.log("contendata mainview: ", contentData)
        navigate({
            pathname: '/generate',
            state: {
                contentData: contentData,
            },
        });
    };

    return (
        <div>
            <h3 className="recentProjectsText">Your Recent Projects</h3>
            <div className="galleryContainer">
                {latestProjects
                    .slice() // Create a copy of the array
                    .reverse() // Reverse the array so that the most recent project is at the top
                    .map(
                        (
                            project,
                            index, // Map each project to a div
                        ) => (
                            <div key={index} className="galleryItem">
                                <Link
                                    to="/generate"
                                    state={{contentData: project.contentData}}
                                    onClick={() => handleNavigateToGenerateView(project.contentData)}
                                >
                                    <div className="projectCard">
                                        <p className="projectName">{project.projectName}</p>
                                        <iframe
                                            title={`Project ${index}`}
                                            srcDoc={project.contentData}
                                            className="galleryProject"
                                            frameBorder="0"
                                        />
                                    </div>
                                </Link>
                            </div>
                        )
                    )}
            </div>
        </div>
    );
}

export default MainContent;
