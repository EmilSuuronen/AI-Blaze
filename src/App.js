import './App.css';
import NewProject from './views/NewProject';

export default function App() {
    return (
        HomeScreen()
    );
};

function HomeScreen() {
    return (
        <div style={{ 
            // display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' 
            }}>
            {/* <h1>Home</h1> */}
            <NewProject></NewProject>
        </div>
    );
}
