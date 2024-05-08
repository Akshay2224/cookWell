import React from "react";
import Navbar from "../components/navbar";
import Info from "../components/info";
import Footer from "../components/footer";

function Home() {
  return (
    <div className="home-section">
      <Navbar />
      <Info />
      <Footer />
    </div>
  );
}

export default Home;
