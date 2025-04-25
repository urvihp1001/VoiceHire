import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
function login() {
  return (
    <div>
      <div className='flex flex-col items-center justify-center h-screen'>
        <div className='flex flex-col items-center border rounded-2xl p-8'>
        <Image
        src={'/logo2.png'} alt='logo'
        width={400}
        height={100}
        className='w-[180px]'
        />
        <div>
          <Image src={'/loginpic.png'}
          alt='login'
          width={600}
          height={400}
          className='w-[400px] h-[250px] rounded-2xl'
          />
          <h2 className='text-2xl font-bold text-center'>Welcome to VoiceHire</h2>
          <p className='text-gray-500 text-center'>Sign In With Google</p>
          <Button className='mt-7 w-full'>Login with Google</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default login