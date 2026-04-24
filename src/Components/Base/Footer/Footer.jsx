import React from 'react'
import './footer.css'
import SocialMedia from './SocialMedia/SocialMedia'
import Movies from './Movies/Movies'
import Series from './Series/Series'
import NewsLetter from './Newsletter/NewsLetter'
import Copyrights from './Copyrights/Copyrights'


export default function Footer() {
    return (
        <>
            <footer className="bg-black text-white">
                <div className="container-fluid px-3 px-lg-4">
                    <div className="row gy-4 justify-content-center text-center text-sm-start mb-4 mb-lg-5">
                        <SocialMedia />
                        <Movies />
                        <Series />
                        <NewsLetter />
                        <Copyrights />
                    </div>
                </div>
            </footer>

        </>
    )
}
