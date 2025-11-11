import React from 'react'

import "./App.css";

import Nav from './Nav'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DashBoard from './Screen/DashBoard'
import AddLeave from './Screen/AddLeave'
import LogOut from './Screen/LogOut'
import Profile from './Screen/Profile'
import Fotter from './Component/Fotter'
import SignUp from './Screen/SignUp'
import PrivateComponent from './Component/PrivateComponent'
import Login from './Screen/Login'
import AddAssest from './Screen/Assest/AddAssest'
import AssinnAssest from './Screen/Assest/AssinnAssest'
import Practice from './Screen/Practice'
import Review from './Screen/Review/Review'
import ReviewForm from './Screen/Review/ReviewForm'
import Leave from './Screen/Leave'

function App() {
  return (
    <div className="App">

      <div className="app-layout">
        <BrowserRouter>
          <Nav />
          <header className="App-header">
            <div className="header-content">
              {/* <img
                src="/Applogo.jpeg"
                alt="AEW Smart Logo"
                className="app-logo"
              /> */}
              <h1 className="app-title">Welcome to AEW Smart Service</h1>
            </div>
          </header>

          <div className="main-content">
            <Routes>
              <Route path="/" element={<PrivateComponent />} >
                <Route path="/" element={<DashBoard />} />
                <Route path="/Leave" element={<Leave />} />
                <Route path="/Add" element={<AddLeave />} />
                <Route path="/AssinnAssest" element={<AssinnAssest />} />
                <Route path="/AddAssest" element={<AddAssest />} />
                <Route path="/LogOut" element={<LogOut />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Practice" element={<Practice />} />
                <Route path="/Review" element={<Review />} />
                <Route path="/ReviewForm" element={<ReviewForm />} />
              </Route>
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/Login" element={<Login />} />
            </Routes>
          </div>
          <Fotter />
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App
