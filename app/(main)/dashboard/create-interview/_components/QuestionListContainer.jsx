import React from 'react';
import { Button } from '@/components/ui/button';

const onFinish = () => {
  // You can move this to props if you want!
  import('sonner').then(({ toast }) => toast.success('Interview questions generated successfully!'));
};

function QuestionListContainer({ questions = [], loading, error }) {
  if (loading) {
    return (
      <div className="p-5 bg-blue-50 rounded-xl border border-primary flex gap-5">
        <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <div>
          <h2 className="font-medium">Generating Interview...</h2>
          <p className="text-primary">
            Our AI is crafting personalised questions based on your specifications
          </p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="mt-5 p-5 bg-red-50 rounded-xl border border-red-200">
        <h2 className="text-sm font-bold mb-2 text-red-700">Error</h2>
        <div className="mb-2 text-red-800">{error}</div>
      </div>
    );
  }
  if (!questions.length) return null;

  return (
    <div className="mt-5 space-y-3">
      <h2 className="text-base font-semibold mb-3">Generated Interview Questions</h2>
      <ul className="space-y-2">
        {questions
          .filter(q => typeof q === 'object' && q.question)
          .map((q, i) => (
            <li
              key={i}
              className="p-4 bg-white rounded-lg shadow border flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <span className="font-medium text-gray-800">{q.question}</span>
              </div>
              {q.type && (
                <span className="mt-2 md:mt-0 md:ml-4 text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 font-semibold">
                  {q.type}
                </span>
              )}
            </li>
          ))}
      </ul>
      <div className="mt-4 text-sm text-gray-500">
        <Button onClick={onFinish}>Finish</Button>
      </div>
    </div>
  );
}

export default QuestionListContainer;
