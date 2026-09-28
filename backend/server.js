const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { OAuth2Client } = require("google-auth-library");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

/* ================================
   GOOGLE OAUTH CLIENT
================================ */

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:5001/api/auth/google/callback"
);

/* ================================
   TEST ROUTE
================================ */

app.get("/", (req, res) => {
  res.status(200).send("Opportunity Tracker Backend is running 🚀");
});

/* ================================
   API TEST
================================ */

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend API is working!",
  });
});

/* ================================
   GOOGLE LOGIN
================================ */

app.get("/api/auth/google", (req, res) => {
  try {
    const authUrl = googleClient.generateAuthUrl({
      access_type: "offline",
      scope: [
        "openid",
        "profile",
        "email",
      ],
      prompt: "select_account",
    });

    res.redirect(authUrl);
  } catch (error) {
    console.error("Google login error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to start Google login",
    });
  }
});

/* ================================
   GOOGLE CALLBACK
================================ */

app.get("/api/auth/google/callback", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send("Google authorization code is missing.");
    }

    const { tokens } = await googleClient.getToken(code);

    googleClient.setCredentials(tokens);

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const user = {
      googleId: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    };

    console.log("Google user:", user);

    /*
      For now we simply send the user back to the frontend.

      Later we can store this user in MongoDB
      and create a proper login session/JWT.
    */

    const userData = encodeURIComponent(JSON.stringify(user));

    res.redirect(
      `http://localhost:5174/?login=success&user=${userData}`
    );

  } catch (error) {
    console.error("Google callback error:", error);

    res.status(401).send("Google authentication failed.");
  }
});

/* ================================
   START SERVER
================================ */

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});