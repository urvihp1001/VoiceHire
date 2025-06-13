'use client'

import React, { useRef, useContext, useState, useEffect } from 'react'
import { InterviewDataContext } from '@/app/context/InterviewDataContext'
import { Timer, Mic, PhoneOff } from 'lucide-react'
import Image from 'next/image'
import Vapi from '@vapi-ai/web'
import AlertConformation from './_components/AlertConformation'
import { toast } from 'sonner'

function Start() {
  const context = useContext(InterviewDataContext)
  const [interviewInfo] = context || []
  const vapiRef = useRef(null)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [activeUser, setActiveUser] = useState(false)
  const [error, setError] = useState(null)

  const isInterviewInfoComplete = interviewInfo &&
    typeof interviewInfo.username === 'string' &&
    interviewInfo.username.trim() !== '' &&
    typeof interviewInfo.jobPosition === 'string' &&
    interviewInfo.jobPosition.trim() !== ''

  const getInitials = (name) => {
    if (!name) return ""
    const parts = name.trim().split(" ")
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const initializeVapi = () => {
    if (vapiRef.current) return

    const apiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY
    if (!apiKey || typeof apiKey !== 'string') {
      setError("API key missing or invalid! Set NEXT_PUBLIC_VAPI_PUBLIC_KEY in .env.local")
      return
    }

    const vapiInstance = new Vapi(apiKey)

    vapiInstance.on('error', (err) => {
      setError('Vapi SDK error: ' + (err?.message || err))
      console.error('[Vapi SDK Error Event]', err)
    })

    vapiInstance.on('call-start', () => {
      console.log('Call started')
      toast.success('Call started successfully!')
    })

    vapiInstance.on('call-end', () => {
      console.log('Call end')
      toast.success('Interview ended successfully!')
    })

    vapiInstance.on('speech-start', () => {
      setActiveUser(false)
    })

    vapiInstance.on('speech-end', () => {
      setActiveUser(true)
    })

    vapiRef.current = vapiInstance
  }

  const handleStartInterview = async () => {
    setError(null)
    if (!isInterviewInfoComplete) {
      setError("Interview information is incomplete.")
      return
    }
    if (interviewStarted) return

    initializeVapi()
    const vapi = vapiRef.current
    if (!vapi) {
      setError('Vapi SDK not initialized.')
      return
    }

    const username = interviewInfo.username ?? "Candidate"
    const jobPosition = interviewInfo.jobPosition ?? "the position"
    const questions = interviewInfo.questionList || []
    const questionList = Array.isArray(questions) && questions.length > 0
      ? questions.map(q => q.question).join(', ')
      : 'No questions found'

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage: `Hi ${username}, how are you? Ready for your interview on ${jobPosition}?`,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.
Begin the conversation with a friendly introduction, setting a relaxed yet professional tone.
"Hey there! Welcome to your ${jobPosition} interview. Let’s get started with a few questions!"
Ask one question at a time and wait for the candidate’s response before proceeding.
Keep the questions clear and concise. Below Are the questions ask one by one:
Questions: ${questionList}
Offer hints if they struggle. Provide brief feedback.
Wrap up after 5-7 questions and end on a positive note.
✅ Friendly and witty 🎤
✅ Short, natural responses
✅ Focused on React
            `.trim(),
          },
        ],
      },
    }

    try {
      await vapi.start(assistantOptions)
      setInterviewStarted(true)
      console.log('Vapi assistant started!')
    } catch (err) {
      setError('Error starting Vapi assistant: ' + (err?.message || err))
      console.error('[Vapi start() Exception]', err)
    }
  }

  const stopInterview = () => {
    if (vapiRef.current) {
      vapiRef.current.stop()
      setInterviewStarted(false)
      console.log("Interview stopped")
    }
  }

  useEffect(() => {
    handleStartInterview()
  }, [])

  return (
    <div
      style={{
        margin: "40px auto",
        padding: 32,
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        maxWidth: 600,
        background: "#fff"
      }}
    >
     <style>
{`
  .pulse-ring {
    animation: pulse-ring 1.5s infinite;
    background: rgba(41, 120, 247, 0.15);
  }

  @keyframes pulse-ring {
    0% {
      box-shadow: 0 0 0 0 rgba(41, 120, 247, 0.5);
    }
    70% {
      box-shadow: 0 0 0 15px rgba(41, 120, 247, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(41, 120, 247, 0);
    }
  }
`}
</style>


      <h2
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 32,
          borderBottom: "1px solid #eee",
          paddingBottom: 16
        }}
      >
        AI Interview Session
        <span
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "auto",
            fontSize: 18,
            color: "#555",
            gap: 8,
            background: "#f5f5f7",
            padding: "6px 16px",
            borderRadius: 8
          }}
        >
          <Timer size={20} style={{ marginRight: 6 }} />
          00:00:00
        </span>
      </h2>

      <div
        style={{
          background: "#fafbfc",
          borderRadius: 14,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          padding: "40px 32px",
          marginTop: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
          gap: 40
        }}
      >
        {/* AI Interviewer */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 180
          }}
        >
          <div
  className={!activeUser ? 'pulse-ring' : ''}
  style={{
    width: 110,
    height: 110,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  }}
>
  <Image
    src="/ai.jpg"
    alt="AI Interviewer"
    width={100}
    height={100}
    style={{
      borderRadius: '50%',
      objectFit: 'cover',
      width: 100,
      height: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
    }}
  />
</div>

          <span
            style={{
              fontWeight: 600,
              color: "#444",
              fontSize: 18
            }}
          >
            AI Interviewer
          </span>
        </div>

        {/* Candidate */}
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 180
          }}
        >
          <div
  className={!activeUser ? 'pulse-ring' : ''}
  style={{
    width: 110,
    height: 110,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    background: '#2978f7'
  }}
>
  <span
    style={{
      width: 100,
      height: 100,
      borderRadius: "50%",
      background: "#2978f7",
      color: "#fff",
      fontWeight: 600,
      fontSize: 36,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none",
      boxShadow: "0 2px 8px rgba(0,0,0,0.10)"
    }}
  >
    {getInitials(interviewInfo?.username)}
  </span>
</div>
          <span
            style={{
              fontWeight: 600,
              color: "#444",
              fontSize: 18,
              userSelect: "none"
            }}
          >
            {interviewInfo?.username || "Candidate"}
          </span>
        </div>
      </div>

      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 32 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#4caf50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'not-allowed'
          }}
        >
          <Mic size={28} color="#fff" />
        </div>

        <div
          onClick={stopInterview}
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#f5222d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <PhoneOff size={28} color="#fff" />
        </div>
      </div>

      {error && (
        <div style={{ marginTop: 24, color: '#f5222d', fontWeight: 600, textAlign: 'center' }}>
          {error}
        </div>
      )}

      <AlertConformation onStop={stopInterview} />
    </div>
  )
}

export default Start
