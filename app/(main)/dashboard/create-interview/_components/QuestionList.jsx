import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import QuestionListContainer from './QuestionListContainer';

function QuestionList({ formData }) {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const fetchedOnce = useRef(false);

  useEffect(() => {
    let cancelled = false;
    fetchedOnce.current = false;

    if (formData && !fetchedOnce.current) {
      fetchQuestions(cancelled);
    }
    return () => {
      cancelled = true;
    };
  }, [formData]);

  const fetchQuestions = async (cancelled) => {
    setLoading(true);
    setError('');
    setQuestions([]);
    try {
      const result = await axios.post('/api/ai_model', { ...formData });
      let questionsArr = [];
      if (Array.isArray(result?.data?.interviewQuestions)) {
        questionsArr = result.data.interviewQuestions;
      } else if (Array.isArray(result?.data?.questions)) {
        const first = result.data.questions[0];
        if (typeof first === 'string' && first.startsWith('```')) {
          const match = first.match(/```json\s*([\s\S]*?)\s*```/);
          if (match && match[1]) {
            try {
              const parsed = JSON.parse(match[1]);
              if (Array.isArray(parsed.interviewQuestions)) {
                questionsArr = parsed.interviewQuestions;
              }
            } catch {}
          }
        } else if (typeof first === 'object' && first.question) {
          questionsArr = result.data.questions;
        } else if (typeof first === 'string') {
          questionsArr = result.data.questions.map(q => ({ question: q }));
        }
      }
      if (!Array.isArray(questionsArr) || questionsArr.length === 0) {
        throw new Error('No questions found in response');
      }
      if (!cancelled && !fetchedOnce.current) {
        setQuestions(questionsArr);
        setLoading(false);
        fetchedOnce.current = true;
      }
    } catch (e) {
      if (!cancelled) {
        setError(e.message || 'Server Error');
        setLoading(false);
      }
    }
  };

  // Always render the UI container, passing state as props
  return (
    <QuestionListContainer questions={questions} loading={loading} error={error} />
  );
}

export default QuestionList;
