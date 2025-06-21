'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState, useContext } from 'react';

import Image from 'next/image';
import { Clock, Loader2Icon, Video } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { InterviewDataContext } from '@/app/context/InterviewDataContext';

function Interview() {
  const { interview_id } = useParams();
  const router = useRouter();

  const [interviewDetails, setInterviewDetails] = useState(null);
  const [username, setUsername] = useState('');
  const [useremail, setEmail] = useState('');//undefined variable useremail prevent
  const [loading, setLoading] = useState(false);

  const context = useContext(InterviewDataContext);
  const [interviewInfo, setInterviewInfo] = context;

  useEffect(() => {
    if (interview_id) fetchInterviewDetails();
  }, [interview_id]);

  const fetchInterviewDetails = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('interviews')
      .select('jobPosition, jobDescription, duration, type')
      .eq('interview_id', interview_id);

    setLoading(false);

    if (error || !data?.length) {
      toast('Incorrect or missing interview details');
      return;
    }

    setInterviewDetails(data[0]);
  };

  const onJoinInterview = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('interview_id', interview_id);

    setLoading(false);

    if (error || !data?.[0]) {
      toast('Failed to join interview');
      return;
    }

    setInterviewInfo?.({
      ...data[0],
      username,
      useremail
    });

    router.push(`/interview/${interview_id}/start`);
  };

  return (
    <div className="flex justify-center mt-16">
      <div className="w-full max-w-2xl bg-primary-300 border border-blue-200 rounded-xl shadow-md p-6 flex flex-col items-center">
        <Image src="/logo2.png" alt="AI Recruit Logo" width={120} height={30} className="w-[120px]" />
        <h2 className="text-2xl font-bold mt-4 mb-2 text-blue-900 text-center">AI Powered Interview Platform</h2>
        <Image src="/interview.png" alt="Interview Illustration" width={300} height={180} className="w-[180px] my-4" />

        {interviewDetails && (
          <div className="w-full mb-4 bg-white border border-blue-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">{interviewDetails.jobPosition}</h3>
            <p className="text-blue-900 mb-2">{interviewDetails.jobDescription}</p>
            <div className="flex items-center gap-4 text-blue-700 text-sm">
              <span className="flex items-center gap-1">
                <Clock size={16} /> {interviewDetails.duration}
              </span>
              <span className="flex items-center gap-1">
                <Video size={16} /> {interviewDetails.type}
              </span>
            </div>
          </div>
        )}

   
          <div className="w-full mb-4">
  <label className="block mb-2 font-medium text-blue-800">Enter your username</label>
  <Input
    type="text"
    placeholder="Eg. John Smith"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
  />


<div className="w-full mb-4">
  <label className="block mb-2 font-medium text-blue-800">Enter your email</label>
  <Input
    type="email"
    placeholder="Eg. johnsmith@gmail.com"
    value={useremail}
    onChange={(e) => setEmail(e.target.value)}
  />

</div>

        </div>

        <div className="w-full bg-blue-100 border border-blue-300 rounded-lg p-3">
          <h3 className="font-semibold mb-2 text-blue-800">Before you begin</h3>
          <ul className="list-disc list-inside space-y-1 text-blue-900 text-sm">
            <li>Ensure you have a stable internet connection.</li>
            <li>Find a quiet place to take the interview.</li>
            <li>Be prepared to answer questions about your skills and experience.</li>
          </ul>
        </div>

        <Button
          className="mt-4 bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          disabled={!username || loading}
          onClick={onJoinInterview}
        >
          {loading ? <Loader2Icon className="animate-spin" /> : <Video size={18} />}
          Join Interview
        </Button>
      </div>
    </div>
  );
}

export default Interview;
