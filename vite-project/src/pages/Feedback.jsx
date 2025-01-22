/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Feedback = ({ token }) => {
  const colors = {
    orange: '#ffba5a',
    grey: '#a9a9a9',
  };

  const starsArray = Array(5).fill(0); // Array for rendering stars
  const [currentValue, setCurrentValue] = useState(0); // State for selected stars
  const [hoverValue, setHoverValue] = useState(undefined); // State for hovered stars
  const [message, setMessage] = useState(""); // State for feedback message
  const navigate = useNavigate();

  const handleClick = (value) => {
    setCurrentValue(value);
  };

  const handleMouseOver = (value) => {
    setHoverValue(value);
  };

  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send the feedback data to the server
    const result = await fetch('http://localhost:4000/api/v1/feedback', {
      method: 'POST',
      body: JSON.stringify({ stars: currentValue, message }),
      headers: {
        "Content-Type": "application/json",
        "Auth": token
      },
    });

    if (result.ok) {
      alert("Feedback submitted successfully!");
      navigate('/');
    } else {
      alert("Failed to submit feedback.");
    }

    // Clear the form after submission
    setCurrentValue(0); // Reset stars
    setMessage(""); // Clear message
    setHoverValue(undefined); // Reset hover
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 min-h-screen py-6 px-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">Thank you! Order Placed Successfully</h2>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Feedback Form</h2>

      <div className="flex space-x-2 mb-6">
        {starsArray.map((_, index) => (
          <FaStar
            key={index}
            size={30}
            className="cursor-pointer"
            color={(hoverValue || currentValue) > index ? colors.orange : colors.grey}
            onClick={() => handleClick(index + 1)}
            onMouseOver={() => handleMouseOver(index + 1)}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="What's your feedback?"
        className="w-full max-w-md p-3 border border-gray-300 rounded-lg shadow-sm mb-6 resize-none min-h-[100px] text-gray-700"
      />

      <button
        onClick={handleSubmit}
        className="w-full max-w-md py-3 px-4 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
      >
        Submit Feedback
      </button>
    </div>
  );
};

export default Feedback;
