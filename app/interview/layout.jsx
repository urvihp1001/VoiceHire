'use client'

import React from 'react'
import InterviewHeader from './components/InterviewHeader'
import { InterviewDataContext } from '@/app/context/InterviewDataContext'

function InterviewLayout({ children }) {
  const state = React.useState(null); // returns [interviewInfo, setInterviewInfo]

  return (
    <InterviewDataContext.Provider value={state}>
      <div className='bg-secondary h-screen'>
        <InterviewHeader />
        {children}
      </div>
    </InterviewDataContext.Provider>
  )
}

export default InterviewLayout;
