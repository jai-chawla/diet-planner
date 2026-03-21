import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import './App.css'
import CreationForm from '../pages/CreationForm'
import Preview from '../pages/Preview'

function App() {


  return (
    <Routes>
      <Route path="/" element={<CreationForm />} />
      <Route path="/preview" element={<Preview />} />
    </Routes>
  )
}

export default App
