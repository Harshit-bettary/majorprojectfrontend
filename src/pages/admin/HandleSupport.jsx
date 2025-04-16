import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HandleSupport() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/support', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setInquiries(data);
        } else {
          setError(data.message || 'Failed to fetch support inquiries');
        }
      } catch (err) {
        setError('An error occurred while fetching support inquiries');
      }
    };
    fetchInquiries();
  }, []);

  const handleRespond = async (id) => {
    if (!response.trim()) {
      setError('Response cannot be empty');
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/admin/support/${id}/respond`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ response }),
      });
      const data = await res.json();
      if (res.ok) {
        setInquiries(inquiries.map(i => i._id === id ? { ...i, status: 'Resolved', response } : i));
        setSelectedInquiry(null);
        setResponse('');
      } else {
        setError(data.message || 'Failed to respond to inquiry');
      }
    } catch (err) {
      setError('An error occurred while responding to the inquiry');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 font-sans antialiased">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-indigo-700 mb-8">Handle Support Inquiries</h2>
        {error && <p className="text-red-500 text-base mb-4">{error}</p>}
        <div className="bg-white rounded-lg shadow-md p-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4">User</th>
                <th className="py-2 px-4">Subject</th>
                <th className="py-2 px-4">Message</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map(inquiry => (
                <tr key={inquiry._id} className="border-b">
                  <td className="py-2 px-4">{inquiry.user.name}</td>
                  <td className="py-2 px-4">{inquiry.subject}</td>
                  <td className="py-2 px-4">{inquiry.message}</td>
                  <td className="py-2 px-4">
                    {inquiry.status === 'Resolved' ? (
                      <span className="text-green-500">Resolved</span>
                    ) : (
                      <span className="text-yellow-500">{inquiry.status}</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {inquiry.status !== 'Resolved' && (
                      <button
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="bg-indigo-700 text-white py-1 px-3 rounded-lg hover:bg-indigo-800"
                      >
                        Respond
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedInquiry && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Respond to Inquiry</h3>
            <p className="text-gray-600 mb-2"><strong>Subject:</strong> {selectedInquiry.subject}</p>
            <p className="text-gray-600 mb-4"><strong>Message:</strong> {selectedInquiry.message}</p>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-700"
              rows="4"
              placeholder="Enter your response..."
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRespond(selectedInquiry._id)}
                className="bg-indigo-700 text-white py-2 px-4 rounded-lg hover:bg-indigo-800"
              >
                Submit Response
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => navigate('/admin')}
          className="mt-6 bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-800 transition-colors duration-200"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default HandleSupport;