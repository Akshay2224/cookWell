import React from "react";
import Navbar from "../components/navbar";
import SignInForm from "../components/signInForm";

function signIn() {
  return (
    <div className="signUp-section">
      <Navbar />
      <SignInForm />
    </div>
  );
}

export default signIn;
