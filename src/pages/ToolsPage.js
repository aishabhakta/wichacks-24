import React from "react";
import { Typography, Card, CardContent } from "@mui/material";

function ToolsPage() {
    return (
        <div className="toolsPage">
            <Typography variant="h4" component="h1" className="tools">
                Tools
            </Typography>
            <div className="toolsContainer">
                <Card className="toolsCard">
                    <CardContent>
                        <Typography variant="h4" component="h2" className="subsectionTitle">
                            Healthcare Locators
                        </Typography>
                    </CardContent>
                </Card>    
            </div>
            <div className="toolsContainer">
                <Card className="toolsCard">
                    <CardContent>
                        <Typography variant="h4" component="h2" className="subsectionTitle">
                            Virtual Consultation
                        </Typography>
                    </CardContent>
                </Card> 
            </div>
            <div className="toolsContainer">
                <Card className="toolsCard">
                    <CardContent>
                        <Typography variant="h4" component="h2" className="subsectionTitle">
                            Sleep Tracker
                        </Typography>
                    </CardContent>
                </Card>
            </div>
            <div className="toolsContainer">
                <Card className="toolsCard">
                    <CardContent>
                        <Typography variant="h4" component="h2" className="subsectionTitle">
                            Breastfeeding Tracker
                        </Typography>
                    </CardContent>
                </Card>
            </div>
            <div className="toolsContainer">
                <Card className="toolsCard">
                    <CardContent>
                        <Typography variant="h4" component="h2" className="subsectionTitle">
                            Due Date Estimator
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default ToolsPage;