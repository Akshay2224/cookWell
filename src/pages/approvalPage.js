import React, {useState, useEffect} from "react";
import '../styles/approvalPage.css'; // Import CSS file
import '../styles/dashboard.css'; // Import CSS file

import { Link } from 'react-router-dom';

import { useNavigate  } from "react-router-dom";

const ApproveRecipe = () => {
    const userId = localStorage.getItem('userId'); 
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newValueisApproved, setIsApproved] = useState(false);


    const navigate = useNavigate();

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


    const handleClick = async (recipeId, approved) => {
        try {
            // Display a confirmation dialog before changing the approval status
            let newValue = approved; // Toggle the approval status
            if(!newValue)
            {
                const confirmSubmit = window.confirm('Are you sure you want to submit the approval?');
                if (confirmSubmit) {
                    newValue = true           
                }

            }
            else{
                newValue = false           

            }

            console.log(newValue)
            const token = localStorage.getItem('token'); 
            const userId = localStorage.getItem('userId'); 
            // Post data to the API endpoint
            const response = await fetch(`http://localhost:5001/api/user/${userId}/updateStatus/${recipeId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Include token in the request header
                'Content-Type': 'application/json',
                'userId': userId,
                'recipeId': recipeId
                },
            body: JSON.stringify({status: newValue})
            });          
            // Update recipes state to reflect the change
            if (response.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.error('Error changing approval status:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token'); 
        const userId = localStorage.getItem('userId'); 
        const fetchRecipes = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/user/${userId}/fetchRecipes`, {
                headers: {
                  'Authorization': `Bearer ${token}`, // Include token in the request header
                'userId': userId
                }
            });            
            const data = await response.json();
            setRecipes(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
        };
    
        fetchRecipes();
    }, []);

return (
    <div className="dashboard-container">
    <div className="sidebar">
    <h1 className = "navbar-title">
        <Link onClick={handleHomeButton}>
                    Revive-Well 
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
    <div className="recipe-approval-container">
    <h2>All Recipes</h2>
    {loading ? (
        <p>Loading...</p>
    ) : (
        <table className="recipe-table">
        <thead>
            <tr>
            <th>Recipe Name</th>
            <th>Recipe Owner</th>
            <th>Approved</th>
            <th>Submit</th>
            </tr>
        </thead>
        <tbody>
            {recipes.map((recipe, index) => (
            <tr key={index}>
                <td>{recipe.recipeName}</td>
                <td>{recipe.recipeOwner}</td>
                <td>{recipe.approved ? 'Approved': "Not Approved"}</td>
                <td>
                    <div className="select-container">
                    {recipe.approved ? (
                        <button onClick={() =>handleClick(recipe._id, recipe.approved )}>Disapprove</button>
                        ) : (
                        <button onClick={() =>handleClick(recipe._id, recipe.approved )}>Approve</button>
                    )}
                    </div>
                    </td>
                    <td>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    )}
    </div>
    </div>
    
    );
};

export default ApproveRecipe;