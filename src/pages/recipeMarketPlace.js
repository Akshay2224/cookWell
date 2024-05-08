import React, { useState, useEffect } from 'react';
import '../styles/recipeMarketPlace.css'
import { Link } from 'react-router-dom';
import { useNavigate  } from "react-router-dom";

const Marketplace = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId'); 
    
const [selectedRecipe, setSelectedRecipe] = useState(null);
const [recipes, setRecipes] = useState([]);
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

const handleBuyClick = async(recipe) => {
    console.log(recipe)
    
    try {
        const token = localStorage.getItem('token'); 
        const userId = localStorage.getItem('userId'); 
        const recipeId = recipe._id

        const response = await fetch(`http://localhost:5001/api/user/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`, // Include token in the request header
            'userId': userId
        }
        });

        const data = await response.json();
        if(data && data.moneyEarnedTill-recipe.cookingCost<0)
        {
            alert("Low Amount. Add Money in Wallet")
        }
        else if (data) {
            console.log('data', data)


    try {
        
        const token = localStorage.getItem('token'); 
        const userId = localStorage.getItem('userId'); 

        const response = await fetch(`http://localhost:5001/api/user/${userId}/${recipeId}/increaseViews`, {
        headers: {
            'Authorization': `Bearer ${token}`, // Include token in the request header
            'userId': userId,
            'recipeId': recipeId
        },
        method: 'PUT'

        });
        const dataViews = await response.json();
        if(response.ok)
        {
        }else {
            throw new Error('Failed to fetch user data:', dataViews.message);
            }
        }
        catch(error) {
        console.error('Error updating view count:', error);
        }
        console.log(data.recipeBoughtTill)
        const recipeExists = data.recipeBoughtTill.some(item => String(item.recipeId) === String(recipeId));
        if(recipeExists)
        {
            window.confirm('You have already Bought this recipe, Do you want to continue with this recipe?');
        }
        else{
            window.confirm('Do you want to buy  this recipe?');
        }
        if(!data.isAdmin)
        {

        try {
            const token = localStorage.getItem('token'); 
            const userId = localStorage.getItem('userId'); 
    
            const response = await fetch(`http://localhost:5001/api/user/${userId}/${recipeId}/increaseRecipeBought`, {
            headers: {
                'Authorization': `Bearer ${token}`, // Include token in the request header
                'userId': userId,
                'recipeId': recipeId
            },
            method: 'PUT'
    
            });
            const data = await response.json();
            if(response.ok)
            {
                setSelectedRecipe(recipe);
            }else {
                throw new Error('Failed to fetch user data:', data.message);
                }
            }
            catch(error) {
                console.error('Error updating view count:', error);
            }
        }
        else
        {
            setSelectedRecipe(recipe);

        }
        } else {
        throw new Error('Failed to fetch user data:', data.message);
        }
    } catch (error) {
        console.error('Failed to fetch user data:', error);
      };
    
    }

useEffect(() => {
    const fetchUserData = async () => {
    try {
        const token = localStorage.getItem('token'); 
        const userId = localStorage.getItem('userId'); 

        const response = await fetch(`http://localhost:5001/api/user/${userId}/fetchRecipes`, {
        headers: {
            'Authorization': `Bearer ${token}`, // Include token in the request header
            'userId': userId
        }
        });

        const data = await response.json();
        const approvedRecipes = data.filter(recipe => recipe.approved); // Filter approved recipes
        if (response.ok) {
            setRecipes(approvedRecipes);
            console.log('data', data)
        } else {
        throw new Error('Failed to fetch user data:', data.message);
        }
    } catch (error) {
        console.error('Failed to fetch user data:', error);
    }
    };

    fetchUserData();
}, []);

  const handleCloseForm = () => {
    setSelectedRecipe(null);
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
    </div>
    </div>
    <div className="marketplace">
    <h1>Marketplace</h1>
    <div className="recipes-list">
        {recipes.map(recipe => (
        <div key={recipe._id} className="recipe-card">
            <h2>{recipe.recipeName}</h2>
            <p>By: {recipe.recipeOwner}</p>
            <p>Cooking Time: {recipe.cookingTime} mins</p>
            <p>Cooking Cost: $ {recipe.cookingCost}</p>
            {/* Add more recipe details as needed */}
            <button onClick={() => handleBuyClick(recipe)}>Buy</button>
            {selectedRecipe && recipe.recipeName === selectedRecipe.recipeName && (
                <div className="recipe-form-overlay">
                <div className="recipe-form">
                    <button onClick={handleCloseForm}>Close</button>
                    <h2>{selectedRecipe.recipeName}</h2>
                    <p>By: {selectedRecipe.recipeOwner}</p>
                    {/* <p>Ingredients Required: {selectedRecipe.ingredients}</p> */}
                    <p>Instructions: {selectedRecipe.instructions}</p>

                    <p>Cooking Time: {selectedRecipe.cookingTime} mins</p>
                    <p>Cooking Cost: $ {selectedRecipe.cookingCost}</p>
                    <p>Video Url: $ {selectedRecipe.videoUrl}</p>

                    <p>View: {selectedRecipe.view}</p>

                    {/* Add more recipe details as needed */}
                </div>
                </div>
            )}
        </div>
        ))}
    </div>

    </div>
    </div>
  );
};


export default Marketplace;
