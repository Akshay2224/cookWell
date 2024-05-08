import React, {useState, useEffect} from "react";
import '../styles/addRecipe.css'; // Import CSS file
import '../styles/dashboard.css'; // Import CSS file

import { Link } from 'react-router-dom';

import { useNavigate  } from "react-router-dom";

const AddRecipe = () => {
    const userId = localStorage.getItem('userId'); 

    const [recipeName, setRecipeName] = useState('');
    const [recipeOwner, setRecipeOwner] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [allIngredients, setAllIngredients] = useState([]);
    const [instructions, setInstructions] = useState('');
    const [cookingCost, setCookingCost] = useState(0); // Initialize cookingCost to 0
    const [cookingTime, setCookingTime] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [showCustomIngredientForm, setShowCustomIngredientForm] = useState(false);
    const [customIngredientData, setCustomIngredientData] = useState({
      name: '',
      type: '',
      cost: ''
    });
    const [alertMessage, setAlertMessage] = useState('');
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
  const handleIngredientChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => ({
        name: option.value,
        cost: parseFloat(option.getAttribute('data-cost')) // Get the cost from data attribute
      }));
      setIngredients(selectedOptions);
    
      // Calculate total cost based on selected ingredients
      const totalCost = selectedOptions.reduce((acc, ingredient) => acc + ingredient.cost, 0);
      setCookingCost(totalCost);
  };

  const handleSubmit = async (e) => {
    const userId = localStorage.getItem('userId'); 
    const token = localStorage.getItem('token'); 
    // Here you can submit the form data to your backend or perform any other actions

  e.preventDefault();
  // Create a payload object with the custom ingredient data
  const ingredientData = {
    recipeName: recipeName,
    recipeOwner: recipeOwner,
    ingredients: ingredients,
    instructions: instructions,
    cookingCost: cookingCost,
    cookingTime: cookingTime,
    videoUrl: videoUrl? videoUrl: '',
    view:0,
    approved:false

  };
  console.log(ingredientData)
  try {
    // Post data to the API endpoint
    const response = await fetch(`http://localhost:5001/api/user/${userId}/addRecipe`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // Include token in the request header
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ingredientData)
    });

    if (response.ok) {
      // If the response is successful, add the custom ingredient to the list
      setAlertMessage('Data saved successfully');
      // Reset the form
      setRecipeName('');
      setRecipeOwner('');
      setIngredients([]);
      setInstructions('');
      setCookingCost(0);
      setCookingTime('');
      setVideoUrl('');

    } else {
      // If the response is not successful, throw an error
      throw new Error('Failed to add custom ingredient');
      
    }
  } catch (error) {
    console.error('Error adding custom ingredient:', error);
    setAlertMessage('Error saving recipe');

    // Handle error appropriately (e.g., display error message to the user)
  }
};
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const userId = localStorage.getItem('userId'); 

        const response = await fetch(`http://localhost:5001/api/user/${userId}/fetchIngredients`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in the request header
            'userId': userId
          }
        });
        const data = await response.json();
        if (response.ok) {
            setAllIngredients(data);
            console.log('data', data)
        } else {
          console.error('Failed to fetch user data:', data.message);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleCustomIngredientChange = (e) => {
    setCustomIngredientData({
      ...customIngredientData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddCustomIngredient = () => {
    setShowCustomIngredientForm(true);
  };
  const handleSubmitCustomIngredient = async (e) => {
    const userId = localStorage.getItem('userId'); 
    const token = localStorage.getItem('token'); 

  e.preventDefault();
  // Create a payload object with the custom ingredient data
  const ingredientData = {
    name: customIngredientData.name,
    ingredientType: customIngredientData.type,
    cost: parseInt(customIngredientData.cost,10)
  };
  console.log(ingredientData)
  try {
    // Post data to the API endpoint
    const response = await fetch(`http://localhost:5001/api/user/${userId}/addIngredients`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // Include token in the request header
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ingredientData)
    });

    if (response.ok) {
      // If the response is successful, add the custom ingredient to the list
      const newIngredient = await response.json();
      setIngredients(prevIngredients => [...prevIngredients, newIngredient]);
      setShowCustomIngredientForm(false);
      // Reset custom ingredient form data
      setCustomIngredientData({
        name: '',
        type: '',
        cost: ''
      });
    } else {
      // If the response is not successful, throw an error
      throw new Error('Failed to add custom ingredient');
    }
  } catch (error) {
    console.error('Error adding custom ingredient:', error);
    // Handle error appropriately (e.g., display error message to the user)
  }
};
  const handleCancelCustomIngredient = () => {
    setShowCustomIngredientForm(false);
    // Reset custom ingredient form data
    setCustomIngredientData({
      name: '',
      type: '',
      cost: ''
    });
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
    <div className="main-content">
    <h2>
            Add Recipe Form
        </h2>
    <form className="recipe-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Recipe Name:</label>
        <input type="text" className="form-control" value={recipeName} onChange={(e) => setRecipeName(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Recipe Owner:</label>
        <input type="text" className="form-control" value={recipeOwner} onChange={(e) => setRecipeOwner(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Ingredients:</label>
        <select multiple className="form-control" value={ingredients.map(ingredient => ingredient.name)} onChange={handleIngredientChange}>
          {allIngredients.map((ingredient, index) => (
            <option key={index} value={ingredient.name} data-cost={ingredient.cost}>{ingredient.name} (${ingredient.cost}) </option>
          ))}
        </select>
        <button type="button" className="btn btn-secondary" onClick={handleAddCustomIngredient}>Add Custom Ingredient</button>
        {showCustomIngredientForm && (
          <div className="custom-ingredient-form">
            <h3>Add Custom Ingredient</h3>
            <form onSubmit={handleSubmitCustomIngredient}>
              <div className="form-group">
                <label>Name:</label>
                <input type="text" className="form-control" name="name" value={customIngredientData.name} onChange={handleCustomIngredientChange} required />
              </div>
              <div className="form-group">
                <label>Type:</label>
                <input type="text" className="form-control" name="type" value={customIngredientData.type} onChange={handleCustomIngredientChange} required />
              </div>
              <div className="form-group">
                <label>Cost:</label>
                <input type="text" className="form-control" name="cost" value={customIngredientData.cost} onChange={handleCustomIngredientChange} required />
              </div>
              <button type="submit" onClick={handleSubmitCustomIngredient} className="btn btn-primary">Add Ingredient</button>
              <button type="button" className="btn btn-secondary" onClick={handleCancelCustomIngredient}>Cancel</button>
            </form>
          </div>
        )}
        </div>
      <div className="form-group">
        <label>Instructions:</label>
        <textarea className="form-control big-textarea" value={instructions} onChange={(e) => setInstructions(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Cooking Cost:</label>
        <input type="text" className="form-control" value={cookingCost} onChange={(e) => setCookingCost(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Cooking Time:</label>
        <input type="text" className="form-control" value={cookingTime} onChange={(e) => setCookingTime(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Video (URL):</label>
        <input type="url" className="form-control" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required />
      </div>
      <button type="submit" className="btn btn-primary">Submit</button>
      {alertMessage && <div>{alertMessage}</div>}
    </form>
    </div>
    </div>
  );
};

export default AddRecipe;