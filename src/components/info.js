import React from "react";
import '../styles/info.css'
import food from "../images/food.jpg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHeart
  } from "@fortawesome/free-solid-svg-icons";

function Info()
{
    return (
        <div className = "info-section">

            <img className="info-image" src={food} alt="hospitalImage"/>
                <div className = "text-overlay">
                    <h3> Unlock the flavors of success!  <FontAwesomeIcon icon={faHeart} style={{color: "#db1414",}} /> </h3>

                    <p> Join our cooking teaching website, where your recipes are not,  </p>
                    <p> just shared but valued. Start your journey today,</p>
                </div>
        </div>
    )
}

export default Info;