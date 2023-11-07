import {Link, Route, BrowserRouter as Router, Routes} from "react-router-dom";
import "./App.css";
import LoginView from "./Login/LoginView";
import CreateNewProject from "./CreateNewProject/CreateNewProject";
import DrawingTools from "./script/DrawingTools";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomeScreen/>}/>
                <Route path="/loginview" element={<LoginView/>}/>
                <Route path="/createNewProject" element={<CreateNewProject/>}/>
                <Route path="/labelEditor" element={<DrawingTools/>}/>
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
                height: "100vh",
            }}
        >
            <h1>Home</h1>
            <Link to="/loginview">
                <button>Login</button>
            </Link>
            <Link to="/createNewProject">
                <button>Create new project</button>
            </Link>
        </div>
    );
}
