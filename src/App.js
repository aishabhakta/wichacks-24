import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import InfoPage from "./pages/InfoPage";
import ToolsPage from "./pages/ToolsPage";
import CommunityPage from "./pages/CommunityPage";
import ChatbotPage from "./pages/ChatbotPage";
import BottomNav from "./components/BottomNav";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/chat" element={<ChatbotPage />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
