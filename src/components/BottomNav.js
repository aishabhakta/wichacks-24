import React, { useState } from "react";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ExploreIcon from "@mui/icons-material/Explore";
import WindowIcon from "@mui/icons-material/Window";
import CommunityIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";

function BottomNav() {
  const [value, setValue] = useState("home");
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(`/${newValue}`);
  };

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000 }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels
        className="custom-bottom-nav-action"
      >
        <BottomNavigationAction
          label="Home"
          value=""
          icon={<HomeRoundedIcon />}
        />
        <BottomNavigationAction
          label="Info"
          value="info"
          icon={<ExploreIcon />}
        />
        <BottomNavigationAction
          label="Tools"
          value="tools"
          icon={<WindowIcon />}
        />
        <BottomNavigationAction
          label="Community"
          value="community"
          icon={<CommunityIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;
