import React from 'react'
import { Routes, Route } from 'react-router-dom'

// Pages
import Home from './pages/Home'
import AtomicTrade from './pages/AtomicTrade'
import Taco from './pages/Taco'
import Wallet from './pages/Wallet'

export default function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="atomic" element={<AtomicTrade />} />
        <Route path="taco" element={<Taco />} />
        <Route path="eos" element={<Wallet />} />
      </Routes>
    </>
  )
}
