import { Button } from '@/components/ui/button'
import { Camera, Video } from 'lucide-react'
import Link from 'next/link'
import React,{useState} from 'react'

function LatestInterviewList() {
    const [interviewList,setInterviewList]=useState([])
  return (
    <div className='my-5'>
        <h2 className='font-bold text-2xl'>Previously Created Interviews</h2>
        {interviewList?.length==0&&<div className='p-5 flex flex-col gap-3 items-center  mt-5'>
            <Video className='h-10 w-10 text-primary'/>
            <h2>You don't have any interviews created!</h2>
            <Button >  <Link href={'/dashboard/create-interview'}>+ Create New Interview</Link></Button>
            </div>
            }
    </div>
  )
}

export default LatestInterviewList