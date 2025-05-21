import React from 'react'
import Image from 'next/image'
function InterviewLink({interviewId, formData}) {
  return (
   <div className='flex items-center justify-center mt-10'> 
     <div>
        <Image src={'/check.png'} alt='check' width={200}
        height={200}
        className='w-[100px] h-[100px]'
        />
        <h2 className='font-bold text-lg'>Your AI Interview is ready</h2>
        <p >Share this link with your candidates to start the interview</p>
    </div>
   </div>
  )
}

export default InterviewLink