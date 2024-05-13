import React from 'react';
import Signup from './Components/Signup.jsx';
import { Routes, Route } from "react-router-dom";
import Dashboard from './Components/Dashboard.jsx'
import Getallbill from './Components/Getallbill.jsx';
import Getallinventory from './Components/Getallinventory.jsx';
import Getallcustomer from './Components/Getallcustomer.jsx';
import Getallorder from './Components/Getallorder.jsx';
import Getallcategory from './Components/Getallcategory.jsx';
import Login from './Components/Login.jsx';
import Resetpassword from "./Components/Resetpassword.jsx"
import Addcategory from "./Components/Addcategory.jsx"
import Editcategory from './Components/Editcategory.jsx';
import Editinventory from "./Components/Editinventory.jsx"
import Addinventory from "./Components/Addinventory.jsx"
import Addcustomer from './Components/Addcustomer.jsx';
import Addorder from './Components/Addorder.jsx';
import Addbill from './Components/Addbill.jsx';

const App = () => {

  
  return (
    <div className="App">
      <Routes>
        
          <Route exact path="/home" element={<Dashboard />} />
          <Route path="/getbills" element={<Getallbill />} />
          <Route path="/getinventories" element={<Getallinventory />} />
          <Route path="/getcustomers" element={<Getallcustomer />} />
          <Route path="/getorders" element={<Getallorder />} />
          <Route path="/getcategories" element={<Getallcategory />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/resetpassword" element={<Resetpassword />} />
          <Route path="/addcategory" element={<Addcategory />} />
          <Route path="/editcategory/:id" element={<Editcategory />} />
          <Route
            path="/editinventory/:inventoryId"
            element={<Editinventory />}
          />
          <Route path="/addinventory" element={<Addinventory />} />
          <Route path="/addcustomer" element={<Addcustomer />} />
          <Route path="/addorder" element={<Addorder />} />
          <Route path="/addbill" element={<Addbill />} />
        
      </Routes>
    </div>
  );
};

export default App;