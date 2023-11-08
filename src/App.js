import {Link, Route, BrowserRouter as Router, Routes} from "react-router-dom";
import "./App.css";
import EditView from "./Edit/EditView";
import LoginView from "./Login/LoginView";
import CreateNewProject from "./CreateNewProject/CreateNewProject";
import LabelingView from "./LabelingView/LabelingView";
import GenerateView from "./GenerateView/GenerateView";
import NewProject from "./NewProject/NewProject";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomeScreen/>}/>
                <Route path="/loginview" element={<LoginView/>}/>
                <Route path="/createNewProject" element={<CreateNewProject/>}/>
                <Route path="/labelEditor" element={<LabelingView/>}/>
                <Route path="/generate" element={<GenerateView/>}/>
            </Routes>
        </Router>
    );
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/loginview" element={<LoginView />} />
        <Route path="/newprojectview" element={<NewProject />} />
        <Route path="/editview" element={<EditView />} />
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
      <Link to="/newprojectview">
        <button>NewProject</button>
      </Link>
      <Link to="/editview">
        <button>Edit</button>
      </Link>
    </div>
  );
}
