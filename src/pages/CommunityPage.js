import React, { useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";

const forumTopics = [
  {
    title: "High-Risk Pregnancy Support",
    members: 233,
    emoji: "🤰",
  },
  {
    title: "Nutrition",
    members: 203,
    emoji: "🍎",
  },
  {
    title: "Health & Wellness",
    members: 186,
    emoji: "💪",
  },
  {
    title: "Postpartum Mental Health",
    members: 346,
    emoji: "💚",
  },
  // Add more topics...
];

const CommunityPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="community-page">
      <div className="community-heading">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          className="community-title"
        >
          Community
        </Typography>
      </div>
      <div className="group-heading">
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          className="group-topics-title"
        >
          Group Topics
        </Typography>
      </div>
      <div className="search-bar-box">
        <TextField
          fullWidth
          id="search-community-topics"
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
      <div className="forum-card-container">
        <Grid container spacing={2}>
          {forumTopics.map((topic, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Link to={`/community/${topic.title}`} className="forum-link">
                <Card variant="outlined" className="forum-card">
                  <CardContent>
                    <Typography
                      variant="h5"
                      component="h3"
                      className="emoji-styles"
                    >
                      {topic.emoji}
                    </Typography>{" "}
                    <Typography
                      variant="h5"
                      component="h3"
                      className="forum-card-title"
                    >
                      {topic.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="forum-card-members"
                    >
                      {topic.members} Members{" "}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default CommunityPage;
