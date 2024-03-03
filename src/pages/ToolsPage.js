import React from "react";
import { Typography, Card, CardContent } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhonelinkRingIcon from '@mui/icons-material/PhonelinkRing';
import NightlightIcon from '@mui/icons-material/Nightlight';
import CribIcon from '@mui/icons-material/Crib';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

function ToolsPage() {
    return (
        <div className="toolsPage">
            <Typography variant="h4" component="h1" className="tools">
                Tools
            </Typography>
            <div className="toolsContainer">
                <Card className="toolsCard">
                    <div className="gridIcon">
                        <CardContent>
                            <LocationOnIcon fontSize="large"></LocationOnIcon>
                        </CardContent>
                    </div>
                    <div className="gridText">
                        <CardContent>
                            <Typography variant="h4" component="h2" className="subsectionTitle">
                                Healthcare Locators
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p" className="toolsInfo">
                                Discover maternal health specialists and clinics nearby.
                            </Typography>
                        </CardContent>
                    </div>
                </Card>    
            </div>
            <div className="toolsContainer">
                <Card className="toolsCard">
                    <div className="gridIcon">
                        <CardContent>
                            <PhonelinkRingIcon fontSize="large"></PhonelinkRingIcon>
                        </CardContent>
                    </div>
                    <div className="gridText">
                        <CardContent>
                            <Typography variant="h4" component="h2" className="subsectionTitle">
                                Virtual Consultation
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p" className="toolsInfo">
                                Connect virtually for personalized maternal health guidance. 
                            </Typography>
                        </CardContent>
                    </div>
                </Card> 
            </div>
            <div className="toolsContainer">
                <Card className="toolsCard">
                    <div className="gridIcon">
                        <CardContent>
                            <NightlightIcon fontSize="large"></NightlightIcon>
                        </CardContent>
                    </div>
                    <div className="gridText">
                        <CardContent>
                            <Typography variant="h4" component="h2" className="subsectionTitle">
                                Sleep Tracker
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p" className="toolsInfo">
                                Keep an eye on your sleep for a well-rested pregnancy.
                            </Typography>
                        </CardContent>
                    </div>
                </Card>
            </div>
            <div className="toolsContainer">
                <Card className="toolsCard">
                    <div className="gridIcon">
                        <CardContent>
                            <CribIcon fontSize="large"></CribIcon>
                        </CardContent>
                    </div>
                    <div className="gridText">
                        <CardContent>
                            <Typography variant="h4" component="h2" className="subsectionTitle">
                                Breastfeeding Tracker
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p" className="toolsInfo">
                                Log feeding times for a connected journey.
                            </Typography>
                        </CardContent>
                    </div>
                </Card>
            </div>
            <div className="toolsContainer">
                <Card className="toolsCard">
                    <div className="gridIcon">
                        <CardContent>
                            <CalendarMonthIcon fontSize="large"></CalendarMonthIcon>
                        </CardContent>
                    </div>
                    <div className="gridText">
                        <CardContent>
                            <Typography variant="h4" component="h2" className="subsectionTitle">
                                Due Date Estimator
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p" className="toolsInfo">
                                Input your last period's first day for a quick due date estimate.
                            </Typography>
                        </CardContent>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default ToolsPage;