import { useUser } from '@/app/provider'
import Image from 'next/image'
import React from 'react'

function WelcomeContainer() {
    const {user}=useUser()
  return (
    <div>
        <div className='bg-white p-5 border rounded-2xl w-full'>
            <h2 className='text-lg font-bold'>Welcome Back, {user?.name}</h2>
            <h2 className='text-gray-500'>AI-Driven Interviews</h2>
            {user && <Image src={user?.picture} alt='userImage' width={50} height={50} className='rounded-full'/>}
        </div>
      
    </div>
  )
}

export default WelcomeContainer