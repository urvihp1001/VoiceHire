"use client"

import React, { useEffect } from 'react'
import { InterviewDataContext } from '@/app/context/InterviewDataContext';  
import { Timer, Mic, Phone } from 'lucide-react';
import Image from 'next/image';
import Vapi from '@vapi-ai/web';
function Start() {
    const context = React.useContext(InterviewDataContext);
    const [interviewInfo] = context || [];
    const vapi= new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY, );

    useEffect(() => {
        interviewInfo&&startCall();
    }, [interviewInfo]);

  const startCall = () => {
  console.log("interviewInfo:", interviewInfo); // For debugging
  console.log("interviewInfo.questionList:", interviewInfo?.questionList); // For debugging

  const questions = interviewInfo?.questionList;
  if (Array.isArray(questions) && questions.length > 0) {
    const questionList = questions.map(q => q.question).join(', ');
    console.log("Starting call with questions:", questionList);
  } else {
    console.log("Starting call with questions: No questions found or data not loaded yet.");
  }


    }
    function getInitials(name) {
        if (!name) return "";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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
                                background: "#e0e7ef",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 36,
                                fontWeight: 700,
                                color: "#3a4a5d",
                                marginBottom: 12,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.10)"
                            }}
                        >
                            {getInitials(interviewInfo.username)}
                        </span>
                    ) : (
                        <Image
                            src="/ai.jpg"
                            alt="You"
                            width={100}
                            height={100}
                            style={{
                                borderRadius: "50%",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                                marginBottom: 12
                            }}
                        />
                    )}
                    <span
                        style={{
                            fontWeight: 600,
                            color: "#444",
                            fontSize: 18
                        }}
                    >
                        {interviewInfo?.username}
                    </span>
                </div>
            </div>
            {/* Mic and Phone icons at the bottom */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 32,
                    marginTop: 48
                }}
            >
                <div
                    style={{
                        background: "#e0e7ef",
                        borderRadius: "50%",
                        width: 56,
                        height: 56,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        cursor: "pointer"
                    }}
                    title="Mic"
                >
                    <Mic size={28} color="#3a4a5d" />
                </div>
                <div
                    style={{
                        background: "#ff0000",
                        borderRadius: "50%",
                        width: 56,
                        height: 56,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        cursor: "pointer"
                    }}
                    title="Call"
                >
                    <Phone size={28} color="#3a4a5d" />
                </div>
            </div>
            {/* Interview in progress text */}
            <div
                style={{
                    marginTop: 24,
                    textAlign: "center",
                    fontSize: 18,
                    color: "#2563eb",
                    fontWeight: 600
                }}
            >
                Interview in progress...
            </div>
        </div>
    )
}

export default Start