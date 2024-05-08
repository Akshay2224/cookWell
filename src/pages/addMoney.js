import React, { useState } from 'react';
import '../styles/addRecipe.css'
import { Link } from 'react-router-dom';
import { useNavigate  } from "react-router-dom";

const AddMoney = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId'); 
    

const handleSignOut = () => {
    localStorage.removeItem('token');
    alert('You have been signed out. Please log in again.');

    // You may also want to redirect the user to the sign-in page or perform other actions after signing out
    navigate('/signIn')
};
const handleDashboardButton = () => {
    const userId = localStorage.getItem('userId'); 
    // You may also want to redirect the user to the sign-in page or perform other actions after signing out
    navigate(`/user/${userId}/dashboard`)
};
const handleHomeButton = () => {
    const userId = localStorage.getItem('userId'); 
    // You may also want to redirect the user to the sign-in page or perform other actions after signing out
    navigate(`/user/${userId}`)
};



const [amount, setAmount] = useState('');

const handleChange = (e) => {
  setAmount(e.target.value);
};
const handleSubmit = async (e) => {
    console.log(amount)
    const userId = localStorage.getItem('userId'); 
    const token = localStorage.getItem('token'); 
    e.preventDefault();
    try {
        const response = await fetch(`http://localhost:5001/api/user/${userId}/addMoney`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Include token in the request header
                'userId': userId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({amount:parseInt(amount,10)})
            });
            if(response.ok)
            {
                console.log(response.data);
                //   setAmount('');
                  alert('Money added successfully')
            }

    } catch (error) {
      console.error('Error adding money to wallet:', error);
    }
  };


  return (
    <div className="dashboard-container">

    <div className="sidebar">
      <h1 className = "navbar-title">

          <Link onClick={handleHomeButton}>
                      Eat-Well 
                      <span className="navbar-sign">+</span>
              </Link>
          </h1>
    <div className="sidebar-item">
          <Link to={`/user/${userId}`} className="sidebar-link" onClick={handleDashboardButton}>Home</Link>
        </div>
      <div className="sidebar-item">
        <Link to="/signIn" className="sidebar-link" onClick={handleSignOut}>Sign Out</Link>
      </div></div>
    
    <div>
      <h2>Add Money to Wallet</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Card Number:</label>
          <input
            type="text"
            name="cardNumber"
            required
          />
        </div>
        <div>
          <label>Card Holder Name:</label>
          <input
            type="text"
            name="cardHolderName"
            required
          />
        </div>
        <div>
          <label>Expiration Date:</label>
          <input
            type="text"
            name="expirationDate"
            required
          />
        </div>
        <div>
          <label>CVV:</label>
          <input
            type="text"
            name="cvv"
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={amount}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Money</button>
      </form>
    </div>
    </div>

  );
};


export default AddMoney;
