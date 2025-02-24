import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MatchingForm from "./pages/MatchingForm";
import UsageHistory from "./pages/UsageHistory";
import './App.css';

function App() {
  return (
  <div className="App">
    <Router>
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/matchingForm" element={<MatchingForm />} />
        <Route path="/usageHistory" element={<UsageHistory />} />
      </Routes>
    </Router>
      <Footer />
    </div>
  );
}

export default App;
