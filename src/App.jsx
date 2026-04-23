import React from 'react'
import './App.css'
import Navbar from './Components/Base/NavBar/Navbar'
import Footer from './Components/Base/Footer/Footer.jsx'
import MovieDetailsPage from './Components/Views/MovieDetailsPage/MovieDetailsPage.jsx'

function App() {
    return (<>
        <Navbar />
        <MovieDetailsPage />
        <Footer />
    </>)
}

export default App
