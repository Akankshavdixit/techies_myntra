import Carousel from './components/Carousel';
import CustomerRegistration from './components/CustomerRegistration';
import CustomerLogin from './components/CustomerLogin'
import InfluencerRegistration from './components/InfluencerRegistration';
import InfluencerLogin from './components/InfluencerLogin';
import { BrowserRouter as Router, Route,Routes , Navigate} from 'react-router-dom';
import { SessionProvider, useSession } from './context/SessionContext';
import AllPosts from './pages/AllPosts';
import Explore from './pages/Explore'
import CustomerProfile from './pages/CustomerProfile';
import InfluencerProfile from './pages/InfluencerProfile';
import CreatePost from './components/CreatePost';
import InfluencerAccount from './pages/InfluencerAccount';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import MyFashion from './pages/MyFashion';

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
    
    <Router>
        <Routes>
        <Route path="/" element={session?<Navigate to="/posts" replace />:<Carousel/>} />
        <Route path="/customerregistration" element={!session?<CustomerRegistration />: <AllPosts/>} />
        <Route path="/customerlogin" element={!session?<CustomerLogin />: <AllPosts/>}/>
        <Route path="/influencerregistration" element={!session?<InfluencerRegistration />:<AllPosts/>} />
        <Route path="/influencerlogin" element={!session?<InfluencerLogin />: AllPosts} />
        <Route path = '/posts' element={!session? <Navigate to="/" replace />:<AllPosts/>}/>
        <Route path = '/explore' element={!session? <Navigate to="/" replace />:<Explore/>}/>
        <Route path='/profile' element={session?(check? <InfluencerProfile/>: <CustomerProfile/>):(<Navigate to="/" replace />)}/>
        <Route path='/createpost' element={check?<CreatePost/>:<UnauthorizedPage/>}/>
        <Route path='/influencer/:iname' element={session?<InfluencerAccount/>: null}/>
        <Route path='/myfashion' element={<MyFashion/>}/>
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </Router>

    

  );
}

export default App;
