import Carousel from './components/Carousel';
import CustomerRegistration from './components/CustomerRegistration';
import CustomerLogin from './components/CustomerLogin'
import InfluencerRegistration from './components/InfluencerRegistration';
import InfluencerLogin from './components/InfluencerLogin';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import { SessionProvider, useSession } from './context/SessionContext';
import Navbar from './components/Navbar';
import AllPosts from './pages/AllPosts';
import Explore from './pages/Explore'
import CustomerProfile from './pages/CustomerProfile';
import InfluencerProfile from './pages/InfluencerProfile';
import CreatePost from './components/CreatePost';
import InfluencerAccount from './pages/InfluencerAccount';

function App() {
  console.log('App component rendered');
  const {session}=useSession()
  let check = false
  let role = ''
  if (session){
    role = session.role
    if (role=='influencer'){
      check = true
    }
    console.log(session)
  }
  return (
    <SessionProvider>
    <Router>
        <Routes>
        <Route path="/" element={!session?<Carousel/>:<AllPosts/>} />
        <Route path="/customerregistration" element={<CustomerRegistration />} />
        <Route path="/customerlogin" element={<CustomerLogin />}/>
        <Route path="/navbar" element={<Navbar/>} />
        <Route path="/influencerregistration" element={<InfluencerRegistration />} />
        <Route path="/influencerlogin" element={<InfluencerLogin />} />
        <Route path = '/posts' element={<AllPosts/>}/>
        <Route path = '/explore' element={<Explore/>}/>
        <Route path='/profile' element={check? <InfluencerProfile/>: <CustomerProfile/>}/>
        <Route path='/createpost' element={<CreatePost/>}/>
        <Route path='/influencer/:iname' element={<InfluencerAccount/>}/>


        </Routes>
      
      


    </Router>

    </SessionProvider>

  );
}

export default App;
