/* eslint-disable no-unused-vars */
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home  from './pages/Home'  // Ensure Home is a named export
import About from './pages/About'    // Ensure About is a default export
import SignIn from './pages/SignIn'  // Ensure SignIn is a default export
import SignOut from './pages/SignOut' // Ensure SignOut is a default export
import  Profile  from './pages/Profile'
import Header from './components/Header'
import SignUp from './pages/SignUp'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'
import Search from './pages/Search'

const App = () => {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-out' element={<SignOut />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/listing/:listingId' element={<Listing />} />
        <Route path='/search' element={<Search/>}/>
        <Route  element={<PrivateRoute />} >
        <Route path='/profile' element={<Profile />} />
        <Route path='/create-listing' element={<CreateListing />} />
        <Route path='/update-listing/:listingId' element={<UpdateListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
