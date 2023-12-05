// MainContent.js
import React, {useEffect, useState} from "react";
import "./MainContent.css";
import {Link, useNavigate} from "react-router-dom";

function MainContent({imageUrls}) {
    const [latestProjects, setLatestProjects] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        setLatestProjects(imageUrls.slice(0, 3));
    }, [imageUrls]);

    const handleNavigateToGenerateView = (contentData, documentId) => {
        console.log("contendata galleryview: ", contentData);
        navigate({
            pathname: '/generate',
            state: {
                contentData: contentData,
                documentId: documentId,
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
                                    state={{contentData: project.contentData, documentId: project.documentId}}
                                    onClick={() => handleNavigateToGenerateView(project.contentData, project.documentId)}
                                >
                                    <div className="projectCard">
                                        <p className="projectName">{project.projectName}</p>
                                        <i className="projectDate">Edited: {project.lastUpdated}</i>
                                        <iframe
                                            title={`Project ${index}`}
                                            srcDoc={project.contentData}
                                            className="galleryProject"
                                            frameBorder="0"
                                            scrolling="no"
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
