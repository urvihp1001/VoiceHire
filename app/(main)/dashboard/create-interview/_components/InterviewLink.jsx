import React from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Clock, Mail, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'


function InterviewLink({ interview_id, formData }) {
  const GetInterviewUrl = () => {
    console.log('Interview ID:', interview_id, 'Form Data:', formData);

    // If interview_id is a string, use it. If it's an object, get the property.
    const id = typeof interview_id === 'string'
      ? interview_id
      : interview_id?.interview_id;

    if (!id) return 'Interview ID missing!';
    return `${process.env.NEXT_PUBLIC_HOST_URL}/${id}`;
  };

  // ...rest of your component


  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg flex flex-col items-center border border-indigo-100">
        <Image
          src="/check.png"
          alt="Interview Ready"
          width={90}
          height={90}
          className="mb-5 drop-shadow-lg"
        />
        <h2 className="font-extrabold text-3xl text-indigo-800 mb-2 text-center tracking-tight">
          Interview Link Generated!
        </h2>
        <p className="text-gray-600 mb-7 text-center">
          Share this secure link with your candidate to begin the interview process.
        </p>
        <div className="w-full bg-indigo-50 p-5 rounded-2xl shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-indigo-700">Interview Link</span>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-1">
              <Clock className="w-4 h-4" />
              30 minutes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              defaultValue={GetInterviewUrl()}
              className="w-full border border-indigo-200 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
              readOnly
            />
            <button
              className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold text-sm shadow"
              onClick={() => {
                navigator.clipboard.writeText(GetInterviewUrl())
                  .then(() => {
                    if (window?.toast) {
                      window.toast('Link copied!', { type: 'success' })
                    } else {
                      alert('Link copied to clipboard!')
                    }
                  })
                  .catch(err => {
                    console.error('Failed to copy: ', err)
                    alert('Failed to copy link')
                  })
              }}
            >
              Copy
            </button>
          </div>
        </div>
        <div className='mt-7 bg-white p-5 rounded-2xl shadow-inner w-full'>
          <h2>Share via</h2>
          <div className='flex gap-4 mt-2 w-full'>
            <Button variant={'outline'} className='flex-1 flex items-center justify-center gap-2'>
              <Mail /> Slack
            </Button>
            <Button variant={'outline'} className='flex-1 flex items-center justify-center gap-2'>
              <Mail /> Email
            </Button>
            <Button variant={'outline'} className='flex-1 flex items-center justify-center gap-2'>
              <Mail /> Whatsapp
            </Button>
          </div>
        </div>
        <div className='flex w-full gap-5 justify-between'>
          <Link href={`/dashboard`}>
            <Button>
              <ArrowLeft /> Back to Dashboard
            </Button>
          </Link>
          <Link href='/create-interview'>
            <Button>
              <Plus /> Create New Interview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default InterviewLink
