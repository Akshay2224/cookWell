import React from "react";
import Navbar from "../components/navbar";
import SignUpForm from "../components/signUpForm";

function signUp() {
  return (
    <div className="signUp-section">
      <Navbar />
      <SignUpForm />
    </div>
  );
}

export default signUp;
