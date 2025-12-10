import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SearchMusicTrack from './pages/SearchMusicTrack';
import CreateMusicTrack from './pages/CreateMusicTrack';
import Login from './pages/Login';
import Error from './pages/Error';
import Register from './pages/Register';
import { ROUTE_CREATE, ROUTE_ERROR, ROUTE_HOME, ROUTE_LOGIN, ROUTE_REGISTER } from './_routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE_HOME} element={<SearchMusicTrack />} />
        <Route path={ROUTE_CREATE} element={<CreateMusicTrack />} />
        <Route path={ROUTE_LOGIN} element={<Login />} />
        <Route path={ROUTE_REGISTER} element={<Register />} />
        <Route path={ROUTE_ERROR} element={<Error />} />
        <Route path="*" element={<SearchMusicTrack />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
