import { Phone, Video } from 'lucide-react'
import React from 'react'

function CreateOptions() {
  return (
    <div className='grid grid-cols-2 gap-5'>
      <div className='bg-white border border-gray-200 rounded-lg p-5'>
        <Video className='p-3 text-primary bg-blue-50 rounded-lg  h-12 w-12'/> 
        <h2 className='font-bold'>Create New Interview</h2>
        <p>Create AI Interviews and schedule them with candidates</p>
      </div>
      <div className='bg-white border border-gray-200 rounded-lg p-5'>
        <Phone className='p-3 text-primary bg-blue-50 rounded-lg  h-12 w-12'/> 
        <h2 className='font-bold'>Create Phone Screen Interview</h2>
        <p>Schedule Phone Screen Interviews with candidates</p>
      </div>
    </div>
  )
}

export default CreateOptions