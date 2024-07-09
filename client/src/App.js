import Carousel from "./components/Carousel";
import CustomerRegistration from "./components/CustomerRegistration";
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';


function App() {
  return (
    <Router>
      

    
      
        <Routes>

        <Route path="/carousel" element={<Carousel/>} />
        <Route path="/customerregistration" element={<CustomerRegistration />} />
        </Routes>

      

      


    </Router>
    
  );
}

export default App;
