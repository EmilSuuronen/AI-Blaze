import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import "./App.css";
import EditView from "./Edit/EditView";
import LoginView from "./Login/LoginView";
import CreateNewProject from "./CreateNewProject/CreateNewProject";
import LabelingView from "./LabelingView/LabelingView";
import GenerateView from "./GenerateView/GenerateView";
import NewProject from "./NewProject/NewProject";
import SignupView from "./Signup/SignupView";
import MainScreen from "./HomeScreen/MainScreen";
import LandingPage from "./LandingPageView/LandingPage";
import { AuthContextProvider } from './context/AuthContext';

export default function App() {
    return (
        <AuthContextProvider>
            <Router>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/loginView" element={<LoginView/>}/>
                <Route path="/generate" element={<GenerateView/>}/>
                <Route path="/createNewProject" element={<CreateNewProject/>}/>
                <Route path="/labelEditor" element={<LabelingView/>}/>
                <Route path="/newProjectView" element={<NewProject/>}/>
                <Route path="/editView" element={<EditView/>}/>
                <Route path="/signupview" element={<SignupView />} />
                <Route path="/mainscreen" element={<MainScreen />} />
            </Routes>
            </Router>
        </AuthContextProvider>
    );
}