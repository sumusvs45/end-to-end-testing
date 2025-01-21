/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import  { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Feedback = ({token}) => {
  const colors = {
    orange: '#ffba5a',
    grey: '#a9a9a9',
  };

  const starsArray = Array(5).fill(0); // Array for rendering stars
  const [currentValue, setCurrentValue] = useState(0); // State for selected stars
  const [hoverValue, setHoverValue] = useState(undefined); // State for hovered stars
  const [message, setMessage] = useState(""); // State for feedback message
  const navigate=useNavigate('')

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
        "Auth":token
      },
    });

    if (result.ok) {
      alert("Feedback submitted successfully!");
      navigate('/')
    } else {
      alert("Failed to submit feedback.");
    }

    // Clear the form after submission
    setCurrentValue(0); // Reset stars
    setMessage(""); // Clear message
    setHoverValue(undefined); // Reset hover
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Feedback Form</h2>
      <div style={styles.stars}>
        {starsArray.map((_, index) => (
          <FaStar
            key={index}
            size={30}
            style={{
              marginRight: 10,
              cursor: 'pointer',
            }}
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
        style={styles.textarea}
      />
      <button style={styles.button} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  stars: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  textarea: {
    border: '1px solid #a9a9a9',
    borderRadius: 5,
    width: 300,
    margin: '20px 0',
    minHeight: 100,
    padding: 10,
    fontSize: '16px',
  },
  button: {
    border: 'none',
    borderRadius: 5,
    backgroundColor: '#ffba5a',
    color: 'white',
    width: 300,
    minHeight: 50,
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
  },
};

export default Feedback;
