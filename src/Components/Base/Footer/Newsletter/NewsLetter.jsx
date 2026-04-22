import React from 'react'
import PillInput from '../../../Global/PillInput/PillInput'
import PillBtn from '../../../Global/PillBtn/PillBtn'

export default function NewsLetter() {
    return (
        <>
            <div className="col-12 col-sm-6 col-lg-3 newsletter">
                <p className="mb-2">Join our newsletter for updates and recommendations!</p>
                <form className="row g-2">
                    <div className="col-12 col-sm">
                        <PillInput type="email" placeholder="Email" ariaLabel="Email id=" id="email" />
                    </div>
                    <div className="col-12 col-sm-auto">
                        <PillBtn type="submit">Subscribe</PillBtn>
                    </div>
                </form>
            </div>
        </>
    )
}
