"use client"
import React from 'react'
import InterviewHeader from './components/InterviewHeader'
import { InterviewDataContext } from '@/app/context/InterviewDataContext';
function InterviewLayout({ children }) {
  const [interviewInfo, setInterviewInfo] = React.useState();
  return (
    <InterviewDataContext.Provider value={{interviewInfo, setInterviewInfo}}>
      <div className='bg-secondary h-screen'>
        <InterviewHeader/>
        {children}
    </div>
    </InterviewDataContext.Provider>
  )
}

export default InterviewLayout