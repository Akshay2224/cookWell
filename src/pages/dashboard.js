import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import "../styles/dashboard.css"
import { useNavigate  } from "react-router-dom";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); 

  const { id } = useParams();
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
  const handleRecipeAdd = () => {
    const userId = localStorage.getItem('userId'); 
    // You may also want to redirect the user to the sign-in page or perform other actions after signing out
    navigate(`/user/${userId}/addRecipe `)
  };

  const handleApprovalButton = () => {
    const userId = localStorage.getItem('userId'); 
    // You may also want to redirect the user to the sign-in page or perform other actions after signing out
    navigate(`/user/${userId}/approveRecipe `)
  };

  const handleRecipeView = () => {
    const userId = localStorage.getItem('userId'); 
    // You may also want to redirect the user to the sign-in page or perform other actions after signing out
    navigate(`/user/${userId}/Marketplace `)
  };

  const handleAddMoney = () => {
    const userId = localStorage.getItem('userId'); 
    // You may also want to redirect the user to the sign-in page or perform other actions after signing out
    navigate(`/user/${userId}/addMoney `)
  };



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const userId = localStorage.getItem('userId'); 

        const response = await fetch(`http://localhost:5001/api/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in the request header
            'userId': userId
          }
        });
        
        const data = await response.json();
        if (response.ok) {
          setUserData(data);
        
          // Calculate the cost difference
          console.log('data', data)
        } else {
          console.error('Failed to fetch user data:', data.message);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [id]);

  return (
    <div>
      {userData ? (
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
        </div>

      </div>
      <div className="main-content">
        <h1>Welcome to the Dashboard</h1>
        <h3>{userData.firstName} {userData.lastName}</h3>
        <h3>Recipe Bought Till: 
         {userData.recipeBoughtTill.map((recipes, index) => (
              <div key={index}>
              {recipes.recipeName}
            </div>        
            )
        )
        }  </h3> 
        <h3>RecipesUploadedTill:        
        {userData.recipesUploadedTill && userData.recipesUploadedTill.map((recipes, index) => (
              <div key={index}>
              {recipes.recipeName}
            </div>        
            )
        )
        }
      </h3> 
      <h3>Wallet:        
      $ {userData.moneyEarnedTill}
      </h3> 
      <button className="addRecipeButton" onClick={handleRecipeAdd}>
            Add Recipe
          </button>
        <button className="addRecipeButton" onClick={handleRecipeView}>
          Buy Recipe
        </button>
        <button className="addRecipeButton" onClick={handleAddMoney}>
            Add Money to Wallet
          </button>
      {userData.isAdmin?
              <button className="addRecipeButton" onClick={handleApprovalButton}>
              Approval Button
            </button> 
      :''}
      </div>
    </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfile;
