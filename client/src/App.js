import Carousel from './components/Carousel';
import CustomerRegistration from './components/CustomerRegistration';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';

import AllPosts from './pages/AllPosts';


function App() {
  console.log('App component rendered');
  return (
    
    <Router>
        <Routes>
        <Route path="/carousel" element={<Carousel/>} />
        <Route path="/customerregistration" element={<CustomerRegistration />} />
        <Route path = '/posts' element={<AllPosts/>}/>
        </Routes>
    </Router>

    

  );
}

export default App;
