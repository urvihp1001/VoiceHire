'use client'

import React, { useRef, useContext, useState, useEffect } from 'react'
import { InterviewDataContext } from '@/app/context/InterviewDataContext'
import { Timer, Mic, PhoneOff } from 'lucide-react'
import Image from 'next/image'
import Vapi from '@vapi-ai/web'
import AlertConformation from './_components/AlertConformation'
import { toast } from 'sonner'

function StartInterview(){
  const {interviewInfo, setInterviewInfo} = useContext(InterviewDataContext);
  const vapi= new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY)

  return(
    
      <div className='p-20 lg:px-48 xl:px-56'>
  <h2 className='font-bold text-xl flex justify-between'>
    AI Interview Session
    <span className='flex gap-2 items-center'>
      <Timer/>
      00:00:00

    </span>
  </h2>

<div className='grid grid-cols-1 md:grid-cols-2 gap-7 mt-5'>
  <div className='bg-white h-[400px] rounded-lg border flex items-center justify-center '>
    <Image src={'/ai.jpg'} alt='ai' width={100} height={100}
    className='w-[60px] h-[60px] rounded-full object-cover' 
    />

</div>
</div>
</div>

    


  );
}

export default StartInterview;