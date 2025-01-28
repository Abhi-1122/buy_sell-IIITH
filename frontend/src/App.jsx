import React from 'react'
import {Routes, Route,useLocation} from 'react-router-dom'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Search from './pages/Search'
import History from './pages/History'
import Signup from './pages/Signup'
import Pending from './pages/Pending'
import Navbar from './components/navbar'
import Protected from './components/Protected'
import Bypass from './components/Bypass'
import Profile from './pages/Profile'
import Sell from './pages/Sell'
import Item from './pages/Item'
import { CartProvider } from './components/CartContext'
import Posted from './pages/Posted'
import Deliver from './pages/Deliver'
import Chat from './pages/Chat'
import CasHandler from './pages/CasHandler'

const App = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/signup'];
  return (
    <CartProvider>
    <div>
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}  
      <Routes>
        <Route path="/cart" element={<Protected><Cart /></Protected>}  />
        <Route path="/login" element={<Bypass><Login/></Bypass>} />
        <Route path="/" element={<Protected><Search /></Protected>} />
        <Route path="signup" element={<Bypass><Signup/></Bypass>} />
        <Route path="/profile" element={<Protected><Profile /></Protected>} />
        <Route path="/sell" element={<Protected><Sell /></Protected>} />
        <Route path="item/:id" element={<Protected><Item/></Protected>} />
        <Route path="/history" element={<Protected><History/></Protected>} />
        <Route path="/posted" element={<Protected><Posted/></Protected>} />
        <Route path="pending" element={<Protected><Pending/></Protected>}  />
        <Route path='/deliver/:id' element={<Protected><Deliver/></Protected>} />
        <Route path='/chat' element={<Protected><Chat/></Protected>} />
        <Route path='/auth/cas' element={<CasHandler/>}/>
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
    </CartProvider>
  )
}

export default App