import { useState } from 'react';

function AddReview({ vehicleId, onReviewAdded }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (rating < 1 || rating > 5) {
      setError('Rating must be between 1 and 5');
      setLoading(false);
      return;
    }

    if (!comment.trim()) {
      setError('Comment cannot be empty');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${vehicleId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          rating,
          comment,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        onReviewAdded();
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      setError('An error occurred while submitting the review: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-base">{error}</p>}
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Rating (1-5)</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-700"
          disabled={loading}
        />
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-2">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-700"
          rows="4"
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${
          loading
            ? 'bg-gray-300 cursor-not-allowed text-gray-600'
            : 'bg-indigo-700 text-white hover:bg-indigo-800'
        }`}
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

export default AddReview;