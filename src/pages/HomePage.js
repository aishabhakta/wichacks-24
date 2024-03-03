import React from "react";
import { Typography, Box, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function HomePage() {
  const userName = "Katie"; // This could be dynamic based on user data

  return (
    <div className="homePage">
      {/* Profile Icon in the top right corner */}
      <div className="profileIconContainer">
        <IconButton className="profileIconButton">
          <AccountCircleIcon fontSize="large" className="profileIcon" />
        </IconButton>
      </div>

      {/* Welcome Message */}
      <div className="welcomeMessage">
        <Typography variant="subtitle1" component="h2" className="welcomeBack">
          Welcome back,
        </Typography>
        <Typography variant="h4" component="h1" className="userName">
          {userName}
        </Typography>
      </div>

      {/* Inspirational Quote */}
      <div className="quoteContainer">
        <Typography component="p" className="inspirationalQuote">
          “Enjoy the beautiful things around you.”
        </Typography>
      </div>
    </div>
  );
}

export default HomePage;
