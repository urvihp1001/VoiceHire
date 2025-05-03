import { Loader2Icon } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner';
import axios from 'axios'

function QuestionList({ formData }) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (formData) {
      GenerateQuestionList();
    }
  }, [formData]);

  const GenerateQuestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post('/api/ai_model', {
        ...formData
      });
      console.log(result.data);
      // drill down to the content
      const content = result.data.choices[0].message.content;
      // optionally split into lines
      const list = content.split('\n').filter(line => line.trim() !== '');
      setQuestions(list);
      setLoading(false);
    } catch (e) {
      toast("Server Error, try again");
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className='p-5 bg-blue-50 rounded-xl border border-gray-100 flex gap-5'>
          <Loader2Icon className='animate-spin' />
          <div>
            <h2>Generating Interview...</h2>
            <p>Our AI is crafting personalised questions based on your specifications</p>
          </div>
        </div>
      )}

      {!loading && questions.length > 0 && (
        <div className='mt-5 p-5 bg-white rounded-xl border border-gray-100'>
          <h2 className='text-sm font-medium mb-2'>Generated Questions</h2>
          <ul className='list-disc list-inside space-y-1'>
            {questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default QuestionList;
