import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home";

import SignIn from "./pages/signIn"
import SignUp from "./pages/signUp"
import UserProfile from "../src/pages/dashboard"
import Marketplace from "../src/pages/recipeMarketPlace"
import AddRecipe from "./pages/addRecipe";
import ApproveRecipe from "./pages/approvalPage";
import AddMoney from "./pages/addMoney";
// import Appointment from "./Pages/Appointment";

function App() {
  return (
    <div className="App">
      <Router basename="/">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/user/:userId/addRecipe" element={<AddRecipe />} />
          <Route path="/user/:userId/Marketplace" element={<Marketplace />} />
          <Route path="/user/:userId/approveRecipe" element={<ApproveRecipe />} />
          <Route path="/user/:userId/addMoney" element={<AddMoney />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;