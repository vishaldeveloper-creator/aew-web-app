import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import "./App.css";

import Nav from "./Nav";
import Fotter from "./Component/Fotter"; // ✅ FIX
import PrivateComponent from "./Component/PrivateComponent";

// Screens
import DashBoard from "./Screen/DashBoard";
import Leave from "./Screen/Leave";
import AddLeave from "./Screen/AddLeave";
import Profile from "./Screen/Profile";
import LogOut from "./Screen/LogOut";
import Practice from "./Screen/Practice";

// Assets (KEEP YOUR SPELLING)
import AssinnAssest from "./Screen/Assest/AssinnAssest"; // ✅ FIX
import AddAssest from "./Screen/Assest/AddAssest";       // ✅ FIX

// Review
import Review from "./Screen/Review/Review";
import ReviewForm from "./Screen/Review/ReviewForm";

// Tasks
import TaskList from "./Screen/Task/TaskList";
import TaskForm from "./Screen/Task/TaskForm";
import TaskDetail from "./Screen/Task/TaskDetail";

// Auth
import SignUp from "./Screen/SignUp";
import Login from "./Screen/Login";

/* ===== LAYOUT ===== */
function Layout({ children }) {
  const location = useLocation();
  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      {!hideLayout && <Nav />}
      {children}
      {!hideLayout && <Fotter />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>

          {/* 🔐 PROTECTED */}
          <Route element={<PrivateComponent />}>
            <Route path="/" element={<DashBoard />} />

            <Route path="/leave" element={<Leave />} />
            <Route path="/leave/add" element={<AddLeave />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/logout" element={<LogOut />} />
            <Route path="/practice" element={<Practice />} />

            <Route path="/assets/assign" element={<AssinnAssest />} />
            <Route path="/assets/add" element={<AddAssest />} />

            <Route path="/review" element={<Review />} />
            <Route path="/review/form" element={<ReviewForm />} />

            <Route path="/tasks" element={<TaskList />} />
            <Route path="/tasks/create" element={<TaskForm />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
          </Route>

          {/* 🌍 PUBLIC */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
