import React, { useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const InfoPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Example article data
  const articles = [
    {
      title: "Understanding High-Risk Pregnancy: Causes and Precautions",
      emoji: "👶",
    },
    {
      title: "The Impact of Nutrition on Maternal and Fetal Health",
      emoji: "🤰",
    },
    {
      title: "Postpartum Mental Health: What to Expect and How to Cope",
      emoji: "💚",
    },
  ];

  // Example topics data
  const topics = [
    {
      title: "Wellness Tips",
      content: "Explore wellness tips for a healthy pregnancy.",
    },
    {
      title: "Postpartum Prep",
      content: "Preparing for the postpartum period.",
    },
    // Add more topics as needed
  ];

  return (
    <div className="info-page">
      <div className="info-heading">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          className="info-title"
        >
          Information
        </Typography>
      </div>
      <div className="search-bar-box">
        <TextField
          fullWidth
          id="search-info-topics"
          label="Search..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-bar"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <div className="articles-heading">
        <Typography variant="h5" component="h2" className="articles-title">
          Articles for You
        </Typography>
      </div>
      <div className="articles-container">
        {articles.map((article, index) => (
          <Card key={index} className="article-card">
            <CardContent>
              <Typography variant="h5" component="h3" className="emoji-styles">
                {article.emoji}
              </Typography>{" "}
              <Typography
                gutterBottom
                variant="subtitle1"
                className="info-article"
              >
                {article.title}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="explore-topics-heading">
        <Typography
          variant="h5"
          component="h2"
          className="explore-topics-title"
        >
          Explore Topics
        </Typography>
      </div>

      <div className="explore-topics-container">
        <Grid container spacing={2}>
          {topics.map((topic, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card className="topic-card">
                <CardContent>
                  <Typography variant="h6" className="topic-title">
                    {topic.title}
                  </Typography>
                  <Typography className="topic-content">
                    {topic.content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default InfoPage;
