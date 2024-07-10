import Carousel from './components/Carousel';
import CustomerRegistration from './components/CustomerRegistration';
import CustomerLogin from './components/CustomerLogin'
import InfluencerRegistration from './components/InfluencerRegistration';
import InfluencerLogin from './components/InfluencerLogin';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import Navbar from './components/Navbar';
import AllPosts from './pages/AllPosts';


function App() {
  console.log('App component rendered');
  return (
    <SessionProvider>
    <Router>


    
      
        <Routes>
        <Route path="/carousel" element={<Carousel/>} />
        <Route path="/customerregistration" element={<CustomerRegistration />} />
        <Route path="/customerlogin" element={<CustomerLogin />}/>
        <Route path="/navbar" element={<Navbar/>} />
        <Route path="/influencerregistration" element={<InfluencerRegistration />} />
        <Route path="/influencerlogin" element={<InfluencerLogin />} />
        <Route path = '/posts' element={<AllPosts/>}/>


        </Routes>
      
      


    </Router>

    </SessionProvider>

  );
}

export default App;
