import { useUser } from '@/app/provider'
import Image from 'next/image'
import React from 'react'

function WelcomeContainer() {
    const {user}=useUser()
  return (
    <div>
        <div className='bg-white p-5 border rounded-2xl w-full flex items-center'>
          <div className=' flex flex-col'>
            <h2 className='text-lg font-bold'>Welcome Back, {user?.name}</h2>
            <h2 className='text-gray-500'>AI-Driven Interviews</h2>
            </div>
              <div className='ml-auto'>
              {user && <Image src={user?.picture} alt='userImage' width={50} height={50} className='rounded-full'/>}
          
            
            </div>
        </div>
      
    </div>
  )
}

export default WelcomeContainer