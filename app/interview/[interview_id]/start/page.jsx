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

  useEffect(()=>{
    interviewInfo && vapi.startInterview();
  },[interviewInfo])
  const startCall=()=>{
    if(interviewInfo){

    }
  }
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
  <div className='bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center '>
    <Image src={'/ai.jpg'} alt='ai' width={100} height={100} 
    className='w-[100px] h-[100px] rounded-full object-cover' 
    />
    <h2>AI Recruiter</h2>
</div>
 <div className='bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center '>
   <h2
   className='text-7xl font-bold text-center bg-primary text-white p-3 rounded-full px-5'
   >{interviewInfo?.username[0]}</h2>
<h2>{interviewInfo?.username}</h2>
</div>
</div>
<div className='flex justify-center items-center mt-10 gap-5'>
  <Mic className='bg-gray-500 p-3 rounded-full text-white w-12 h-12  cursor-pointer' onClick={()=>{}} />
  <PhoneOff className='bg-red-500 text-white p-3 rounded-full w-12 h-12 ml-3 cursor-pointer' onClick={()=>{}} />
</div>
<h2 className='text-sm text-gray-400 text-center mt-5'>Interview in Progress...</h2>
</div>
    


  );
}

export default StartInterview;