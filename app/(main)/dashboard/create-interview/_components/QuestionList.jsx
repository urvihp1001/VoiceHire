import { Loader2Icon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

function QuestionList({ formData }) {
  const [loading, setLoading] = useState(true);
  const [questionList, setQuestionList] = useState([]);

  useEffect(() => {
    let cancelled = false;

    if (formData) {
      GenerateQuestionList(cancelled);
    }

    return () => {
      cancelled = true;
    };
  }, [formData]);

  const GenerateQuestionList = async (cancelled) => {
    setLoading(true);
    try {
      const result = await axios.post('/api/ai_model', {
        ...formData,
      });

      let content = result.data.content;
      console.log("Raw Response Content:", content);

      // Extract JSON from Markdown block
      const match = content.match(/```json\s*([\s\S]*?)\s*```/i);
      const cleaned = match ? match[1] : content;
      console.log("Cleaned JSON String:", cleaned);

      const parsed = JSON.parse(cleaned);

      if (!cancelled) {
        setQuestionList(parsed);
        setLoading(false);
      }
    } catch (e) {
      console.error("Error during question generation:", e);
      toast(`Server Error: ${e.message}`);
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className="p-5 bg-blue-50 rounded-xl border border-primary flex gap-5">
          <Loader2Icon className="animate-spin" />
          <div>
            <h2 className="font-medium">Generating Interview...</h2>
            <p className="text-primary">
              Our AI is crafting personalised questions based on your specifications
            </p>
          </div>
        </div>
      )}

      {!loading && (
        <div className="mt-5 p-5 bg-white rounded-xl border border-gray-100">
          <h2 className="text-sm font-medium mb-2">Generated Questions</h2>
          <ul className="list-disc list-inside space-y-1">
            {questionList.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default QuestionList;
