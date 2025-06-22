import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import QuestionListContainer from './QuestionListContainer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/services/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@/app/provider';
// import {onCreateLink} from './InterviewLink'; // Don't import this here

function QuestionList({ formData, onCreateLink }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const fetchedOnce = useRef(false);

  useEffect(() => {
    let cancelled = false;
    if (formData && !fetchedOnce.current) {
      fetchQuestions(cancelled);
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line
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

  const onFinish = async () => {
    setSaveLoading(true);
    try {
      const interview_id = uuidv4();
      const { data, error } = await supabase
        .from('interviews')
        .insert([
          {
            ...formData,
            questionList: questions,
            userEmail: user?.email,
            interview_id,
          }
        ])
        .select();
      if (error) {
        toast.error('Failed to save to Supabase!');
      } else {
        toast.success('Saved to Supabase!');
        console.log('Interview created:', data);
        onCreateLink({ interview_id });
      }
    } catch (e) {
      toast.error('An error occurred while saving!');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div>
      <QuestionListContainer questions={questions} loading={loading} error={error} />
      <div className="mt-4 text-sm text-gray-500">
        <Button onClick={onFinish} disabled={saveLoading}>
          {saveLoading && <span className="animate-spin mr-2">⏳</span>}
          Create Interview Link & Finish
        </Button>
      </div>
    </div>
  );
}

export default QuestionList;
