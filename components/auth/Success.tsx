import React from 'react'
import { Checked } from '../icons/Icons'

const Success: React.FC = () => {
    return (
        <div className="bg-white p-6 rounded-[24px] w-full max-w-md grid place-items-center text-center gap-4">
            <Checked width={100} height={100} />
            <p className="font-bold text-3xl">Account created successfully</p>
            <p className="font-medium text-[#718096]">You have successfully created an account on Event <br /> Parcel, you can now sell Aso Ebi with ease</p>
            <button className="button_v1">Continue</button>
        </div>
    )
}

export default Success
