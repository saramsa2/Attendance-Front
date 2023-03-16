import logo from './logo.svg';
import './App.css';
import Layout from './components/shared/Layout';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';

function App() {
  return (
    <div className="App">
      <Layout>
        <Routes>
        <Route path="login" element={ <Login /> } />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
