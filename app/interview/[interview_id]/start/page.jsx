'use client'

import React, { useRef, useContext, useState, useEffect } from 'react';
import { InterviewDataContext } from '@/app/context/InterviewDataContext';
import { Timer, Mic, PhoneOff } from 'lucide-react';
import Image from 'next/image';
import Vapi from '@vapi-ai/web';
import AlertConformation from './_components/AlertConformation';
import { toast } from 'sonner';
import TimerComponent from './_components/TimerComponent';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';

function StartInterview() {
  const vapi = useRef(null);
  const context = useContext(InterviewDataContext);
  const [interviewInfo, setInterviewInfo] = Array.isArray(context) ? context : [null, () => {}];
  const [activeUser, setActiveUser] = useState(false);
  const [isCallRunning, setIsCallRunning] = useState(false);
  const [conversation, setConversation] = useState([]);
  const conversationRef = useRef([]);
  const { interview_id } = useParams();
  const router = useRouter();
  const feedbackSent = useRef(false);

  useEffect(() => {
    if (!vapi.current) {
      vapi.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
    }
  }, []);

  useEffect(() => {
    if (!vapi.current) return;
    const instance = vapi.current;

    const handleCallStart = () => {
      setIsCallRunning(true);
    };

    const handleCallEnd = () => {
      if (!feedbackSent.current) {
        feedbackSent.current = true;
        GenerateFeedback(conversationRef.current);
      }
    };

    const handleSpeechStart = () => setActiveUser(false);
    const handleSpeechEnd = () => setActiveUser(true);

    const handleMessage = (message) => {
      if (message?.conversation) {
        setConversation(prev => {
          const updated = [...prev, ...message.conversation];
          conversationRef.current = updated;
          return updated;
        });
      }
    };

    instance.on('call-start', handleCallStart);
    instance.on('call-end', handleCallEnd);
    instance.on('speech-start', handleSpeechStart);
    instance.on('speech-end', handleSpeechEnd);
    instance.on('message', handleMessage);

    return () => {
      instance.off('call-start', handleCallStart);
      instance.off('call-end', handleCallEnd);
      instance.off('speech-start', handleSpeechStart);
      instance.off('speech-end', handleSpeechEnd);
      instance.off('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    if (interviewInfo) startCall();
  }, [interviewInfo]);

  const stopInterview = () => {
    setTimeout(() => {
      if (vapi.current) {
        vapi.current.stop();
      }
    }, 200);
  };

  const GenerateFeedback = async (conv) => {
    if (!conv || conv.length === 0) {
      console.warn('Empty or invalid conversation:', conv);
      return;
    }
    console.log('Generating feedback for conversation:', conv);
    try {
      const result = await axios.post('/api/ai_feedback', {
        conversation: conv,
      });
      const Content = result?.data?.content || 'No feedback generated';
      const FINAL_CONTENT = Content.replace('```json', '').replace('```', '').trim();

      await supabase
        .from('interview_feedback')
        .insert({
          username: interviewInfo?.username,
          useremail: interviewInfo?.useremail,
          interview_id: interview_id,
          feedback: JSON.parse(FINAL_CONTENT),
          recco: false,
        });

      router.replace('/interview/completed');
    } catch (err) {
      console.error('Error generating feedback:', err);
    }
  };

  const startCall = () => {
    if (!vapi.current) return;
    const questionList = interviewInfo?.questionList?.map((item) => item.question).join(',');

    const assistantOptions = {
      name: 'AI Recruiter',
      firstMessage: `Hi ${interviewInfo?.username}, how are you? Ready for your interview on ${interviewInfo?.jobPosition}?`,
      transcriber: {
        provider: 'deepgram',
        model: 'nova-2',
        language: 'en-US',
      },
      voice: {
        provider: 'playht',
        voiceId: 'jennifer',
      },
      model: {
        provider: 'openai',
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `
You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.
Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
"Hey there! Welcome to your ${interviewInfo?.jobPosition} interview. Let’s get started with a few questions!"
Ask one question at a time and wait for the candidate’s response before proceeding. Keep the questions clear and concise. Below Are the questions ask one by one:
Questions: ${questionList}
If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
"Need a hint? Think about how React tracks component updates!"
Provide brief, encouraging feedback after each answer. Example:
"Nice! That’s a solid answer."
"Hmm, not quite! Want to try again?"
Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let’s tackle a tricky one!"
After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
"That was great! You handled some tough questions well. Keep sharpening your skills!"
End on a positive note:
"Thanks for chatting! Hope to see you crushing projects soon!"
Key Guidelines:
✅ Be friendly, engaging, and witty 🎤
✅ Keep responses short and natural, like a real conversation
✅ Adapt based on the candidate’s confidence level
✅ Ensure the interview remains focused on React
            `.trim(),
          },
        ],
      },
    };

    vapi.current.start(assistantOptions);
  };

  return (
    <>
      <div className="p-20 lg:px-48 xl:px-56">
        <h2 className="font-bold text-xl flex justify-between">
          AI Interview Session
          <span className="flex gap-2 items-center">
            <TimerComponent running={isCallRunning} />
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
          <div className="bg-blue h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
            <div className="relative w-[100px] h-[100px]">
              {!activeUser && (
                <span className="absolute inset-0 rounded-full bg-blue-500 animate-pulse-ring z-10"></span>
              )}
              <Image
                src={'/ai.jpg'}
                alt="ai"
                width={100}
                height={100}
                className="w-[100px] h-[100px] rounded-full object-cover relative z-10"
              />
            </div>
            <h2>AI Recruiter</h2>
          </div>

          <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
            <div className="relative w-[120px] h-[120px] flex items-center justify-center">
              {activeUser && (
                <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring z-0"></span>
              )}
              <h2 className="text-7xl font-bold text-center bg-primary text-white p-3 rounded-full px-5 relative z-10">
                {interviewInfo?.username?.[0]}
              </h2>
            </div>

            <div className="flex justify-center items-center mt-10 gap-5">
              <Mic className="bg-gray-500 p-3 rounded-full text-white w-12 h-12 cursor-pointer" />
              <AlertConformation stopInterview={stopInterview}>
                <PhoneOff className="bg-red-500 text-white p-3 rounded-full w-12 h-12 ml-3 cursor-pointer" />
              </AlertConformation>
            </div>
            <h2 className="text-sm text-gray-400 text-center mt-5">Interview in Progress...</h2>
          </div>
        </div>
      </div>
    </>
  );
}

export default StartInterview;
