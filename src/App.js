import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Register } from './components/Register';
import { Login } from './components/Login';
import Layout from './components/Layout';
import Unauthorized from './components/Unauthorized';
import Admin from './components/Admin';
import Missing from './components/Missing';
import Editor from './components/Editor';
import Home from './components/Home';
import Links from './components/Links';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* public routes */}
        <Route path="links" element={<Links />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* protected routes */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
          <Route path="editor" element={<Editor />} />
          <Route path="admin" element={<Admin />} />
        </Route>

        {/* catch routes */}
        <Route path="*" element={<Missing />} />


      </Route>
    </Routes>
  );
}

export default App;
