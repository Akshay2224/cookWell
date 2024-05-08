import React, { useState } from 'react';
import '../styles/signIn.css'; // Import CSS file
import { useNavigate  } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const  handleLinks = (param) =>{
        navigate(param)
    }  
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
    
            if (response.ok) {
                // Login successful
                const userData = await response.json();
                // Store user data in local storage or state
                localStorage.setItem('user', JSON.stringify(userData));
                console.log(userData)
                const token = userData.token
                // Store the token in local storage
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userData.userId);
                if(userData.isAdmin)
                {
                    navigate(`/user/admin/${userData.userId}`);
                    console.log('Login successful');
                }
                else{
                    // Redirect or navigate to protected route
                    navigate(`/user/${userData.userId}`);
                    console.log('Login successful');
                }
                console.log("here", userData, token)
                // Redirect or navigate to protected route
                console.log('Login successful');
            } else {
                // Login failed
                const data = await response.json();
                alert('Invalid Credentials. Please Try again.');

                console.log('Login failed:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form className="login-form">
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="button" onClick={handleLogin}>Login</button>
            </form>
            <button className="register-button" onClick={() => handleLinks("/signUp")}>Register</button>
        </div>
    );
}

export default Login;
