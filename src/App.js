import './App.scss';
import { Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout/index.js';
import Home from './Components/Home/index.js';
import Query from './Components/Query/index.js';

function App() {
  return(
    <>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element = {<Home />} />
        <Route path="/query" element={<Query />} /> 
      </Route>
    </Routes>
    </>
  )
}

export default App;

//        <Route path="/home" element={<Home />} />
