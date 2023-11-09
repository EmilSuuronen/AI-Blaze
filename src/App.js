import {Link, Route, BrowserRouter as Router, Routes} from "react-router-dom";
import "./App.css";
import EditView from "./Edit/EditView";
import LoginView from "./Login/LoginView";
import CreateNewProject from "./CreateNewProject/CreateNewProject";
import LabelingView from "./LabelingView/LabelingView";
import GenerateView from "./GenerateView/GenerateView";
import NewProject from "./NewProject/NewProject";
import HeaderBar from "./components/Header/HeaderBar";
import SignupView from "./Signup/SignupView";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomeScreen/>}/>
                <Route path="/loginView" element={<LoginView/>}/>
                <Route path="/generate" element={<GenerateView/>}/>
                <Route path="/createNewProject" element={<CreateNewProject/>}/>
                <Route path="/labelEditor" element={<LabelingView/>}/>
                <Route path="/newProjectView" element={<NewProject/>}/>
                <Route path="/editView" element={<EditView/>}/>
                <Route path="/signupview" element={<SignupView />} />
            </Routes>
        </Router>
    );
}

function HomeScreen() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <HeaderBar/>
            <h1>Home</h1>
            <Link to="/loginView">
                <button>Login</button>
            </Link>
            <Link to="/newProjectView">
                <button>Create a new project</button>
            </Link>
            <Link to="/createNewProject">
                <button>Create a new project (TEST)</button>
            </Link>
            <Link to="/editView">
                <button>Edit</button>
            </Link>
        </div>
    );
}
