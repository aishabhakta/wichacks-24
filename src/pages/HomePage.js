import React from "react";
import { Typography, Card, CardContent, Box, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function HomePage() {
  const userName = "Katie"; // This could be dynamic based on user data
  const fruit = "🍌"; // This could be dynamic based on user data

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

      {/* Fruit Emoji */}
      <div className="fruitContainer">
        <Typography variant="h4" component="h1" className="fruit">
          {fruit}
        </Typography>
      </div>

      {/* Pregnancy Progress Card */}
      <div className="progressContainer">
        <Card className="progressCard">
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="h2"
              className="progressInfo1"
            >
              Pregnancy Progress
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              className="progressInfo2"
            >
              <b>Week:</b> 20
              <br />
              <b>Trimester:</b> 2nd
              <br />
              <b>Baby's Size:</b> Banana
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              className="progressInfo3"
            >
              <b> </b>
              <br />
              Halfway there! Your baby is now the size of a banana. Keep up the
              good work, and don’t forget to take a moment to celebrate this
              special milestone.
            </Typography>
          </CardContent>
        </Card>
      </div>
      {/* Symptoms Card */}
      <div className="symptomsContainer">
        <Card className="symptomsCard">
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="h2"
              className="symptomsInfo1"
            >
              Your Symptoms
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              className="symptomsInfo2"
            >
              List symptoms here...
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* More content can be added here */}
    </div>
  );
}

export default HomePage;
