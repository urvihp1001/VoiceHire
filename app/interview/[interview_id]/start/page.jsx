'use client'

import React, { useRef, useContext, useState } from 'react'
import { InterviewDataContext } from '@/app/context/InterviewDataContext'
import { Timer } from 'lucide-react'
import Image from 'next/image'
import Vapi from '@vapi-ai/web'
import AlertConformation from './_components/AlertConformation'

function Start() {
  const context = useContext(InterviewDataContext)
  const [interviewInfo] = context || []
  const vapiRef = useRef(null)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [error, setError] = useState(null)

  // Ensure required fields are present
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

  // Initialize Vapi with API key as a string
  const initializeVapi = () => {
    if (vapiRef.current) return

    const apiKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY
    console.log('API Key:', apiKey, typeof apiKey)

    if (!apiKey || typeof apiKey !== 'string') {
      setError("API key missing or invalid! Set NEXT_PUBLIC_VAPI_PUBLIC_KEY in .env.local")
      return
    }

    // Correct usage: pass the API key as a string, not an object!
    const vapiInstance = new Vapi(apiKey)

    vapiInstance.on('error', (err) => {
      setError('Vapi SDK error: ' + (err?.message || err))
      console.error('[Vapi SDK Error Event]', err)
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

    // --- FIX: Send assistant options directly, NOT wrapped in { assistant: ... } ---
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
Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
"Hey there! Welcome to your ${jobPosition} interview. Let’s get started with a few questions!"
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
        {/* Interviewer */}
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
          <Image
            src="/ai.jpg"
            alt="AI Interviewer"
            width={100}
            height={100}
            style={{
              borderRadius: "50%",
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
              marginBottom: 12
            }}
          />
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
          {interviewInfo?.username ? (
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
                marginBottom: 12,
                userSelect: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)"
              }}
            >
              {getInitials(interviewInfo.username)}
            </span>
          ) : null}
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
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        {!interviewStarted && (
          <button
            onClick={handleStartInterview}
            style={{
              padding: '12px 32px',
              fontSize: 18,
              fontWeight: 600,
              background: '#2978f7',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              boxShadow: "0 2px 8px rgba(41,120,247,0.10)"
            }}
          >
            Start Interview
          </button>
        )}
        {interviewStarted && (
          <button
            onClick={stopInterview}
            style={{
              padding: '12px 32px',
              fontSize: 18,
              fontWeight: 600,
              background: '#f5222d',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              marginLeft: 16,
              boxShadow: "0 2px 8px rgba(245,34,45,0.10)"
            }}
          >
            Stop Interview
          </button>
        )}
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
