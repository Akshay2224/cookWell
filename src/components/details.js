import React from "react";
import "../styles/details.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

// Function will add details
function Details() {
  return (
    <div>
      <div className="hospital-overview-section">
        Hopsital Overview and History
        <p>Hospital History will go here</p>
      </div>
      <div className="about-doctors-section">
        About Our Doctors and Team
        <p>About our doctors information will go here</p>
      </div>
      <div className="achievements-section">
        Our Recognitions & Achievements{" "}
        <p>Our Recognition and Achievements will go here</p>
      </div>
      <div className="community-engagement-section">
        Community Engagement or Initiatives
        <p>Community Engagament action will go here</p>
      </div>
      <div className="contact-Infomrmation-section">
        Contact Information Section
        <p>Contact Information will go here</p>
      </div>
    </div>
  );
}

export default Details;
