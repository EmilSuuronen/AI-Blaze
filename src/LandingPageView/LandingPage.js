import "./LandingPageStyles.css";
import HeaderBar from "../components/Header/HeaderBar";
import {Link} from "react-router-dom";

export default function LandingPage() {

    return (
        <div className="div-main-landing-page">
            <div className="div-main-container-get-started">
                <div className="div-landing-page-details">
                    <div className="div-title">Welcome to AI-blaze</div>
                    <div className="text-description-landing-page">
                        Create amazing amazing websites for mobile and desktop
                        from your own hand drawn designs using AI. Get started <b>by creating an account or logging in.</b>
                    </div>

                    <div className="div-login-buttons">
                        <Link to="/loginView">
                            <button className="button-login">Login</button>
                        </Link>
                        <Link to="/signupView">
                            <button className="button-sign-up" >Sign Up</button>
                        </Link>
                    </div>
                </div>

                <div className="div-landing-page-details-image">
                    <div className="text-features-title">Features</div>
                    <img src={require('./res/image1.png')} alt={"image1"}/>

                    <img src={require('./res/saveimg.png')} alt={"saveimg"}/>
                </div>
            </div>
        </div>
    );
}