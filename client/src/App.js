import Carousel from "./components/Carousel";
import CustomerRegistration from "./components/CustomerRegistration";
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';


function App() {
  return (
    <SessionProvider>
    <Router>
      

    
      
        <Routes>

        <Route path="/carousel" element={<Carousel/>} />
        <Route path="/customerregistration" element={<CustomerRegistration />} />
        </Routes>

      

      


    </Router>

    </SessionProvider>
    
  );
}

export default App;
