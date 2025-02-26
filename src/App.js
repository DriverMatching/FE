import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import MatchingForm from "./pages/MatchingForm";
import MatchingResult from "./pages/MatchingResult";
import UsageHistory from "./pages/UsageHistory";
// import './App.css';

function App() {
  return (
  <div className="App">
    <Router>
    <Header />
      <Routes>
        <Route path="/" element={<MatchingForm />} />
        <Route path="/matching-result" element={<MatchingResult />} />
        <Route path="/usageHistory" element={<UsageHistory />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
