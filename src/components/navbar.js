import React, { useEffect} from 'react';
import '../styles/navbar.css'
import { Link } from "react-router-dom";
import { useNavigate  } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faRightToBracket
  } from "@fortawesome/free-solid-svg-icons";


function Navbar () {
    const navigate = useNavigate();

    const  handleLinks = (param) =>{
        navigate(param)
    }    

    useEffect(() => {
        fetch('http://localhost:5001/api/items')
            .then(response => response.json())
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);


    return (
        
        <div className="navbar-section">
            <h1 className = "navbar-title">
            <Link to="/">
                Eat-Well 
                <span className="navbar-sign">+</span>
                </Link>
            </h1>
            
            <ul className="navbar-items">
                <li>
                <Link to="/" className="navbar-links">
                    Home
                </Link>
                </li>
                <li>
                <button className="navbar-btn" onClick={() => handleLinks("/signUp")}> 
                    <FontAwesomeIcon icon={faRightToBracket}/>  Login/Sign Up 
                </button>
                </li>
            </ul>
        </div>
    )
} 

export default Navbar;