import { Input } from '@/components/ui/input'
import React from 'react'

function FormContainer() {
  return (
    <div className='p-5 bg-white'>
        <div>
            <h2 className='text-sm'>
                Job Position
            </h2>
            <Input placeholder="e.g. Full Stack Developer"/>
        </div>
    </div>
  )
}

export default FormContainer