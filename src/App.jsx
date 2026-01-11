import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import View from './pages/View'
import Auth from './users/Auth'
import StoreList from './pages/StoreList'
import Header from './users/Header'
import Footer from './users/Footer'
import OwnerLogin from './components/OwnerLogin'
import OwnerRegister from './components/OwnerRegister'
import AdminDashboard from './components/AdminDashboard'
import OrderMedicines from './pages/OrderMedicines'
import Pnf from './users/Pnf'
import Storedashboard from './components/Storedashboard'



function App() {
  return (
    <>
     <Routes>
      <Route path='/login' element={<Auth/>}/>
      <Route path='/register' element={<Auth isRegister={true}/>}/>
      <Route path='/' element={<Home/>}/>
      <Route path='/view/:id' element={<View/>}/>
      <Route path='/storelist' element={<StoreList/>}/>
      <Route path='/ownerlogin' element={<OwnerLogin/>}/>
      <Route path='/ownerRegister' element={<OwnerRegister/>}/>
      <Route path='/dashboard' element={<AdminDashboard/>}/>
      <Route path='/store/dashboard' element={<Storedashboard/>}/>
      <Route path='/ordermedicines' element={<OrderMedicines/>}/>
      <Route path='/*' element={<Pnf/>}/>    
    </Routes> 
    </>
  )
}

export default App