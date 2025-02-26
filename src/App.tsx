import { Outlet } from 'react-router-dom';
import './styles/App.css';

function App() {
  return (
    <div className="app">
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
