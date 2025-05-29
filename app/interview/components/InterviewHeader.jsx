import Image from 'next/image'
import React from 'react'

function InterviewHeader() {
  return (
    <div className='p-4 shadow-sm'>
        <Image src={'/logo2.png'} alt="AI Recruit Logo" width={120} height={30} className="w-[90px]" />
    </div>
  )
}

export default InterviewHeader