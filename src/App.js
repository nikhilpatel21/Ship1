import logo from './logo.svg';
import './App.css';
import Counter from './components/Counter';
import {Routes, Route} from 'react-router-dom';
import Home from './components/Home';
import DragDrop from "./components/DragDrop"
import ReactVirtualizedList from './components/ReactVirtualizedList';
import FetchData from './components/FetchData';
import DebounceSearchBar from './components/DebounceSearchBar';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/counter" element={< Counter/>} />
      <Route path="/fetch-data" element={< FetchData/>} />
      <Route path="/list" element={< ReactVirtualizedList/>} />
      <Route path="/search-bar" element={< DebounceSearchBar/>} />
      <Route path="/drag-drop" element={< DragDrop/>} />
    </Routes>
  );
}

export default App;
