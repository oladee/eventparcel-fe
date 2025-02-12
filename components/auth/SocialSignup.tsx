import React from 'react'
import { Facebook, Google, Apple } from '../icons/Icons'

const SocialSignup: React.FC = () => {
  return (
    <div className="grid lg:grid-cols-3 gap-4">
    <button className="authButton">
      <Google width={20} height={20} /> Google
    </button>
    <button className="authButton">
      <Facebook width={20} height={20} /> Facebook
    </button>
    <button className="authButton">
      <Apple width={20} height={20} /> Apple
    </button>
  </div>
  )
}

export default SocialSignup
