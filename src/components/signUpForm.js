import React, { useState } from 'react';
import '../styles/signUp.css'; // Import CSS file
import { useNavigate  } from "react-router-dom";

function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nationality, setNationality] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [favouriteDish, setFavouriteDish] = useState(''); // State variable to store selected gender

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const  handleLinks = (param) =>{
        navigate(param)
    }  
    const handleRegister = async (e) => {
        try {
            e.preventDefault();
            // Here you can add your validation logic
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
            } else {
              // Proceed with form submission
            const response = await fetch('http://localhost:5001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstName, lastName, nationality, favouriteDish, city, zipCode, phoneNumber, email, password })
            });
            if (response.ok) {

                // Registration successful
                console.log('Registration successful');
                alert('Registartion Complete')
            } else {
                // Registration failed
                const data = await response.json();
                console.log('Registration failed:', data.message);
            }
         }
            } catch (error) {
                console.error('Error:', error);
            }
    };

    return (
        <div className="registration-container">
            <h2>Registration</h2>
            <form className="registration-form">
                <div>
                    <label>FirstName:</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div>
                    <label>LastName:</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div>
                    <label>Nationality:</label>
                    <input type="text" value={nationality} onChange={(e) => setNationality(e.target.value)} />
                </div>
                <div>
                    <label>Favourite Dish:</label>
                    <input type="text" value={favouriteDish} onChange={(e) => setFavouriteDish(e.target.value)} />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>City:</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div>
                    <label>Zip Code:</label>
                    <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                </div>
                <div>
                    <label>Phone Number:</label>
                    <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <button onClick={handleRegister}>Register</button>
            </form>
            <button className="login-button" onClick={() => handleLinks("/signIn")}>Login</button>

        </div>
    );
}

export default Register;
