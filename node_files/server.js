const express = require('express');
const app = express();
const PORT = process.env.PORT || 5001; // Use port 5000 or environment port
const cors = require('cors'); // Import cors middleware
const session = require('express-session');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcrypt');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const { ObjectId } = require('mongodb');

app.use(session({
  secret: 'reviveWellProject', // Change this to a random string for security
  resave: false,
  saveUninitialized: false
}));

// Define routes and middleware here
app.use(cors());



const password = encodeURIComponent("Akshay@22")

const uri = `mongodb+srv://akshaykhn7:${password}@akshaycluster.fj3yenj.mongodb.net/?retryWrites=true&w=majority&appName=AkshayCluster`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


// function to check if connection is working fine
// will be removed once every API is in its place
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}


run().catch(console.dir);



app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Connect to MongoDB
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    // Get reference to user collection
    const collection = client.db('foodProject').collection('users');

    // Find user by email
    const user = await collection.findOne({ email });
    // Close MongoDB connection
    await client.close();

    if (user) {
      // Compare hashed password
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        // Store user data in session
        req.session.user = {
          id: user._id,
          email: user.email,
          gender: user.gender
          
        };
        const userId = req.session.user.id; 
        const token = jwt.sign({ userId }, 'foodProject', { expiresIn: '1h' }); // Generate token
        // Send response with user data
        res.status(200).json({ message: 'Login successful', 'token': token, 'userId': userId });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.use((req, res, next) => {
  console.log('Request Headers:', req.headers);
  next();
});

// function for the verification of token whole running any api
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];; // Get token from request header
  if (!token || token === 'null') { // Check if token is null or 'null'
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  try {
    const decoded = jwt.verify(token, 'foodProject'); // Verify token
    req.user = decoded.userId; // Attach userId to request object
    next(); // Call next middleware
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};


// POST endpoint for registration
app.post('/api/register',async (req, res) => {
    const { firstName, lastName, nationality, favouriteDish, city, zipCode, phoneNumber, email, password } = req.body;
    try {
        // Hash the password

        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds

        // Connect to MongoDB
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        // Get reference to user collection
        const collection = client.db('foodProject').collection('users');
        const userDetail = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          city: city,
          zipCode: zipCode,
          phoneNumber: phoneNumber,
          recipeBoughtTill: [],
          recipesUploadedTill: [],
          favouriteDish:favouriteDish,
          nationality: nationality,
          isAdmin: false,
          password:hashedPassword,
          moneyEarnedTill:0
        }

        // Insert new user document with hashed password
        await collection.insertOne(userDetail);

        // Close MongoDB connection
        await client.close();

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/api/user/:userId',verifyToken, async (req, res) => {
  const _id = req.params.userId; 
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();

  // Get reference to user collection
  
  const collection = client.db('foodProject').collection('users');
  // Find user by email
  const objectId = new ObjectId(_id);

  // Iterate over the cursor and print each document

  try {

  console.log(_id)
  const user = await collection.findOne({_id: objectId });

  // Close MongoDB connection
  console.log(user)
      // Fetch user data from the database using userId
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Send user data as response
      res.json(user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally{
      await client.close();

    }
});

app.get('/api/user/:userId/fetchIngredients',verifyToken, async (req, res) => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();

  // Get reference to user collection
  
  const collection = client.db('foodProject').collection('ingredients');
  // Find user by email

  // Iterate over the cursor and print each document

  try {

  const user = await collection.find();
  let data = []
  await user.forEach(document => {
    data.push(document);
  });
  // Close MongoDB connection
      // Fetch user data from the database using userId
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Send user data as response
      res.json(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally{
      await client.close();

    }
});


app.post('/api/user/:userId/addIngredients',verifyToken, async (req, res) => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();

  // Get reference to user collection
  
  const collection = client.db('foodProject').collection('ingredients');
  // Find user by email
  console.log(req.body)
  // Iterate over the cursor and print each document

  try {

  const user = await collection.insertOne(req.body);

  // Close MongoDB connection
      // Fetch user data from the database using userId
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Send user data as response
      res.json(user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally{
      await client.close();

    }
});

app.post('/api/user/:userId/addRecipe',verifyToken, async (req, res) => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();

  // Get reference to user collection
  
  const collection = client.db('foodProject').collection('recipes');
  // Find user by email
  console.log(req.body)
  // Iterate over the cursor and print each document

  try {

  const user = await collection.insertOne(req.body);

  // Close MongoDB connection
      // Fetch user data from the database using userId
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Send user data as response
      res.json(user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally{
      await client.close();

    }
});

app.get('/api/user/:userId/fetchRecipes',verifyToken, async (req, res) => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();

  // Get reference to user collection
  
  const collection = client.db('foodProject').collection('recipes');
  // Find user by email

  // Iterate over the cursor and print each document

  try {

  const user = await collection.find();
  let data = []
  await user.forEach(document => {
    data.push(document);
  });
  // Close MongoDB connection
      // Fetch user data from the database using userId
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Send user data as response
      res.json(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally{
      await client.close();

    }
});

app.put('/api/user/:userId/:recipeId/increaseViews',verifyToken, async (req, res) => {
  console.log(req.params)
  const recipeId = req.params.recipeId;

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();

  // Get reference to user collection
  
  const collection = client.db('foodProject').collection('recipes');
  // Find user by email
  const objectId = new ObjectId(recipeId);

  try {

    const result = await collection.updateOne({ _id: objectId }, { $inc: { view: 1 } });

    // Send success response
   // Check if the recipe was found and updated
   if (result.nModified === 0) {
    return res.status(404).json({ message: 'Recipe not found or view count not updated' });
  }

  // Send success response
  return res.status(200).json({ message: 'View count incremented successfully' });    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally{
      await client.close();

    }
});

app.put('/api/user/:userId/:recipeId/increaseRecipeBought',verifyToken, async (req, res) => {
  console.log(req.params)
  const userId = req.params.userId;
  const userIdRecipe = req.params.recipeId;

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();

  // Get reference to user collection
  
  const collection = client.db('foodProject').collection('users');
  const collectionRecipe = client.db('foodProject').collection('recipes');

  // Find user by email
  const objectIdRecipe = new ObjectId(userIdRecipe);
  const objectId= new ObjectId(userId);

  try {

    const recipe = await collectionRecipe.findOne({ _id: objectIdRecipe});

    // Retrieve the bought recipe details
    const recipeCheck = await collection.findOne({_id: objectId});
    const recipeExists = recipeCheck.recipeBoughtTill.some(item => String(item.recipeId) === String(userIdRecipe));
    if(!recipeExists)
    {
      await collection.updateOne(
        { _id: objectId },
        {
          $push: { recipeBoughtTill: { recipeId: objectIdRecipe, recipeName: recipe.recipeName, recipeCost: recipe.cookingCost } }
        }
      );
      const recipeUser = await collection.findOne({ _id: objectId});
          
      console.log(recipeUser.moneyEarnedTill)
      console.log(recipe.cookingCost)
      const newValue = recipeUser.moneyEarnedTill - recipe.cookingCost ;
  
      if(recipeUser)
      {
        await collection.updateOne(
          { _id: objectId },
          {
            $set: { moneyEarnedTill: newValue } 
          }
        );
      }
    }
   // Check if the recipe was found and updated
    if (res.nModified === 0) {
    return res.status(404).json({ message: 'Recipe not found or view count not updated' });
  }

  // Send success response
  return res.status(200).json({ message: 'View count incremented successfully' });    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally{
      await client.close();

    }
});

app.post('/api/user/:userId/updateStatus/:recipeId',verifyToken, async (req, res) => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const userId = req.params.userId;
  const userIdRecipe = req.params.recipeId;

  const collection = client.db('foodProject').collection('users');
  const collectionRecipe = client.db('foodProject').collection('recipes');

  // Iterate over the cursor and print each document
  const objectIdRecipe = new ObjectId(userIdRecipe);
  const objectId = new ObjectId(userId);

  try {
  const recipe = await collectionRecipe.findOne({ _id: objectIdRecipe});
    // Close MongoDB connection
    if(recipe)
    {
          await collectionRecipe.updateOne(
          { _id: objectIdRecipe },
          {
            $set: { approved: req.body.status}
          }
        );

          const recipeUser = await collection.findOne({ firstName: recipe.recipeOwner});

          const recipeAdmin = await collection.findOne({ _id: objectId});

          const newValue = recipeAdmin.moneyEarnedTill + 5 ;
          const newValueUser = recipe.cookingCost + recipeUser.moneyEarnedTill - 5;

          if(recipeUser)
          {
            await collection.updateOne(
              { _id: objectId },
              {
                $set: { moneyEarnedTill: newValue } 
              }
            );
            await collection.updateOne(
              { firstName: recipe.recipeOwner },
              {
                $set: { moneyEarnedTill: newValueUser } 
              }
            );
            const recipeExists = recipeUser.recipesUploadedTill && recipeUser.recipesUploadedTill.some(item => String(item.recipeId) === String(userIdRecipe));
            console.log(recipeExists)
            if(!recipeExists)
            {
              await collection.updateOne(
                { firstName: recipe.recipeOwner },
                {
                  $push: { recipesUploadedTill: { firstName: recipe.recipeOwner, recipeName: recipe.recipeName, recipeCost: recipe.cookingCost } }
                }
              );
            }
          }  
      }
    // Send user data as response
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally{
      await client.close();
    }
});

app.post('/api/user/:userId/addMoney',verifyToken, async (req, res) => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const userId = req.params.userId;
  console.log(req)

  const collection = client.db('foodProject').collection('users');

  // Iterate over the cursor and print each document
  const objectId = new ObjectId(userId);

  try {
    // Close MongoDB connection




          const recipeAdmin = await collection.findOne({ _id: objectId});

          const newValueUser = req.body.amount + recipeAdmin.moneyEarnedTill ;
          console.log(newValueUser, req.body, recipeAdmin.moneyEarnedTill)
          if(newValueUser>0)
          {
            await collection.updateOne(
              { _id: objectId },
              {
                $set: { moneyEarnedTill: newValueUser } 
              }
            );


      }
    // Send user data as response
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally{
      await client.close();
    }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});