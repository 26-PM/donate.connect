import React, { useState } from 'react';

const TestimonialForm = () => {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch('/api/testimonials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, author }),
    });

    if (response.ok) {
      setMessage('Testimonial submitted successfully!');
      setText('');
      setAuthor('');
    } else {
      setMessage('Failed to submit testimonial.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-background dark:bg-background/95 shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-lg mx-auto border dark:border-border"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-foreground dark:text-foreground">Submit Your Testimonial</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your testimonial here..."
        required
        className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-primary bg-background dark:bg-background/95 text-foreground dark:text-foreground dark:border-border"
      />
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Your name"
        required
        className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-primary bg-background dark:bg-background/95 text-foreground dark:text-foreground dark:border-border"
      />
      <div className="mt-4">
        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80"
        >
          Submit Testimonial
        </button>
      </div>
      {message && (
        <p className="mt-4 text-center text-green-500 dark:text-green-400">
          {message}
        </p>
      )}
    </form>
  );
};

export default TestimonialForm;