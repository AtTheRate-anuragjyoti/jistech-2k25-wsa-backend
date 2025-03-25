// server.js
import { Hono } from 'hono';
import { db } from 'src/utils/firebase.js';  // Import the Firestore instance
import argon2 from 'argon2';

const app = new Hono();

// Endpoint to register user
app.post('/register', async (ctx) => {
  const { email, password } = await ctx.req.json();

  try {
    // Hash the password using Argon2
    const hashedPassword = await argon2.hash(password);

    // Add user data to Firestore (in a collection called "users")
    await db.collection('users').add({
      email: email,
      password: hashedPassword
    });

    return ctx.json({ message: 'User registered successfully' }, 201);
  } catch (error) {
    return ctx.json({ message: 'Error registering user', error: error.message }, 500);
  }
});

// Endpoint to sign in user
app.post('/signin', async (ctx) => {
  const { email, password } = await ctx.req.json();

  try {
    // Query Firestore for the user with the given email
    const userQuerySnapshot = await db.collection('users').where('email', '==', email).get();

    if (userQuerySnapshot.empty) {
      return ctx.json({ message: 'User not found' }, 404);
    }

    // Get the hashed password from Firestore
    const userDoc = userQuerySnapshot.docs[0].data();
    const storedHashedPassword = userDoc.password;

    // Verify the password using Argon2
    const isPasswordCorrect = await argon2.verify(storedHashedPassword, password);

    if (!isPasswordCorrect) {
      return ctx.json({ message: 'Invalid password' }, 401);
    }

    return ctx.json({ message: 'Sign in successful' }, 200);
  } catch (error) {
    return ctx.json({ message: 'Error signing in', error: error.message }, 500);
  }
});

// Start the Hono app
app.listen(3000);
