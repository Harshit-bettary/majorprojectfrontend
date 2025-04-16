import React, { useState, useEffect } from 'react';

function VehicleReviews({ vehicleId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/reviews/${vehicleId}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching reviews:', error);
        setLoading(false);
      });
  }, [vehicleId]);

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return <div>No reviews available for this vehicle.</div>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
          <p className="text-lg font-semibold">{review.user.name}</p>
          <p className="text-gray-600">{review.comment}</p>
          <p className="text-blue-500 font-bold">Rating: {review.rating}/5</p>
        </div>
      ))}
    </div>
  );
}

export default VehicleReviews;