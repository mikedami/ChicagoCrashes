import './App.scss';
import { Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout/index.js';
import Home from './Components/Home/index.js';
import Query1 from './Components/Query1/index.js';
import Query2 from './Components/Query2/index.js';
import Query3 from './Components/Query3/index.js';
import Query4 from './Components/Query4/index.js';
import Query5 from './Components/Query5/index.js';
import Map from './Components/Map/index.js';

function App() {
  return(
    <>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element = {<Home />} />
        <Route path="/query1" element={<Query1 />} /> 
        <Route path="/query2" element={<Query2 />} />
        <Route path="/query3" element={<Query3 />} />
        <Route path="/query4" element={<Query4 />} />
        <Route path="/query5" element={<Query5 />} />
        <Route path="/map" element={<Map />} />

      </Route>
    </Routes>
    </>
  )
}

export default App;

//        <Route path="/home" element={<Home />} />
