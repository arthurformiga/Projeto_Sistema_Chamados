import { Routes, Route } from "react-router-dom";
import Customers from "../pages/Customers/customers";
import DashBoard from "../pages/DashBoard/dashboard";
import New from "../pages/New/new";
import Profile from "../pages/Profile/profile";
import Signin from "../pages/Signin/signin";
import SignUp from "../pages/SignUp/signup";
import Private from "./Privates";

    function RoutesApp(){
    return(
    <Routes>
        <Route path="/" element={<Signin/>}/>
        <Route path="/register" element={<SignUp/>}/>

        <Route path="/dashboard" element={<Private><DashBoard/></Private>}/>
        
        <Route path="/profile" element={<Private><Profile/></Private>}/>

        <Route path="/customers" element={<Private><Customers/></Private>}/>

        <Route path="/new" element={<Private><New/></Private>}/>

        <Route path="/new/:id" element={<Private><New/></Private>}/>
    </Routes>   

    )
}

export default RoutesApp