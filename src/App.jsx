import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'

// Pages
import Home from './pages/Home'
import AtomicTrade from './pages/AtomicTrade'

export default function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home />} />
        <Route path="atomic" element={<AtomicTrade />} />
      </Routes>
    </>
  )
}
