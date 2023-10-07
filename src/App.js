import './App.css';
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import UserDashboard from './pages/user/UserDashboard';
import NewProject from './pages/admin/NewProject';
import AdminDashboard from './pages/admin/AdminDashboard';
import Phase from './pages/admin/Phase';
import Module from './pages/admin/Module';
import Task from './pages/admin/Task';
import env from "react-dotenv";
import Solution from './pages/admin/Solution';
import CustomerList from './pages/admin/CustomerList';

import { useState } from 'react';
import UpdateProject from './pages/admin/UpdateProject';

function App() {

 const [reviewData,setReviewData] = useState()

 return (
   <div className="App">
     <BrowserRouter>
       <Routes>
         <Route path="/admin">
           <Route index path="/admin" element={<AdminDashboard reviewData={reviewData} setReviewData={setReviewData}/>}/>
           <Route path="/admin/newproject" element={<NewProject/>}/>
           <Route path="/admin/updateproject" element={<UpdateProject reviewData={reviewData} setReviewData={setReviewData}/>}/>
           <Route path="/admin/phase" element={<Phase/>}/>
           <Route path="/admin/module" element={<Module/>}/>
           <Route path="/admin/task" element={<Task/>}/>
           <Route path="/admin/solution" element={<Solution/>}/>
           <Route path="/admin/customer" element={<CustomerList/>}/>
           </Route>

           <Route path="/">
            <Route index path="/" element={<UserDashboard/>}  />
            </Route> 
       </Routes>
     </BrowserRouter>     
   </div>
 );
}

export default App;

