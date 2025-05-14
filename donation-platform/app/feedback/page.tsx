// // "use client";
// // import React, { useState, useEffect } from "react";
// // import { useSearchParams } from 'next/navigation';
// // import axios from "axios";


// // interface FeedbackFormProps {
// //   donorId?: string | null;
// // }

// // const FeedbackForm: React.FC<FeedbackFormProps> = ({ donorId }) => {
// //   const [formData, setFormData] = useState({
// //     ngo: "", // wait for donationId to set this
// //     donor: donorId || null,
// //     ease: 3,
// //     pickup: "Yes",
// //     pickupComment: "",
// //     recommend: "Yes",
// //     improvement: "",
// //     rating: 3,
// //   });

// //   const [error, setError] = useState("");
// //   const [success, setSuccess] = useState("");

// //   const searchParams = useSearchParams();

// //   useEffect(() => {
// //     const donationId = searchParams.get("donationId");
// //     if (donationId) {
// //       setFormData(prev => ({
// //         ...prev,
// //         ngo: donationId,
// //       }));
// //     }
// //   }, [searchParams]);

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({ ...prev, [name]: value }));
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setError("");
// //     setSuccess("");

// //     try {
// //       const payload = {
// //         ...formData,
// //         pickupComment: formData.pickup === "Could be improved" ? formData.pickupComment : "",
// //       };

// //       const res = await axios.post("http://localhost:8080/api/feedback/submit", payload);
// //       if (res.status === 201) {
// //         setSuccess("Feedback submitted successfully.");
// //         setFormData({
// //           ngo: formData.ngo,
// //           donor: donorId || null,
// //           ease: 3,
// //           pickup: "Yes",
// //           pickupComment: "",
// //           recommend: "Yes",
// //           improvement: "",
// //           rating: 3,
// //         });
// //       }
// //     } catch (err) {
// //       setError("Something went wrong. Please try again.");
// //     }
// //   };

// //   return (
// //     <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 shadow rounded bg-white">
// //       <h2 className="text-xl font-semibold mb-4">Submit Feedback</h2>

// //       <label className="block mb-2 font-medium">Ease of Process (1-5)</label>
// //       <input
// //         type="number"
// //         name="ease"
// //         min={1}
// //         max={5}
// //         value={formData.ease}
// //         onChange={handleChange}
// //         className="w-full border px-3 py-2 mb-4 rounded"
// //         required
// //       />

// //       <label className="block mb-2 font-medium">Pickup Experience</label>
// //       <select
// //         name="pickup"
// //         value={formData.pickup}
// //         onChange={handleChange}
// //         className="w-full border px-3 py-2 mb-4 rounded"
// //         required
// //       >
// //         <option value="Yes">Yes</option>
// //         <option value="No">No</option>
// //         <option value="Could be improved">Could be improved</option>
// //       </select>

// //       {formData.pickup === "Could be improved" && (
// //         <>
// //           <label className="block mb-2 font-medium">Pickup Comment</label>
// //           <input
// //             type="text"
// //             name="pickupComment"
// //             value={formData.pickupComment}
// //             onChange={handleChange}
// //             className="w-full border px-3 py-2 mb-4 rounded"
// //           />
// //         </>
// //       )}

// //       <label className="block mb-2 font-medium">Would you recommend?</label>
// //       <select
// //         name="recommend"
// //         value={formData.recommend}
// //         onChange={handleChange}
// //         className="w-full border px-3 py-2 mb-4 rounded"
// //         required
// //       >
// //         <option value="Yes">Yes</option>
// //         <option value="No">No</option>
// //         <option value="Not sure">Not sure</option>
// //       </select>

// //       <label className="block mb-2 font-medium">Suggestions for Improvement</label>
// //       <textarea
// //         name="improvement"
// //         value={formData.improvement}
// //         onChange={handleChange}
// //         className="w-full border px-3 py-2 mb-4 rounded"
// //         required
// //       />

// //       <label className="block mb-2 font-medium">Overall Rating (1-5)</label>
// //       <input
// //         type="number"
// //         name="rating"
// //         min={1}
// //         max={5}
// //         value={formData.rating}
// //         onChange={handleChange}
// //         className="w-full border px-3 py-2 mb-4 rounded"
// //         required
// //       />

// //       {error && <p className="text-red-500 mb-2">{error}</p>}
// //       {success && <p className="text-green-500 mb-2">{success}</p>}

// //       <button  onClick={handleSubmit} 
// //         type="submit"
// //         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
// //       >
// //         Submit Feedback
// //       </button>
// //     </form>
// //   );
// // };

// // export default FeedbackForm;


"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import axios from "axios";

interface FeedbackFormProps {
  donorId?: string | null;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ donorId }) => {
  const [formData, setFormData] = useState({
    ngo: "", 
    donor: donorId || null,
    ease: 3,
    pickup: "Yes",
    pickupComment: "",
    recommend: "Yes",
    improvement: "",
    rating: 3,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const donationId = searchParams.get("donationId");
    if (donationId) {
      setFormData(prev => ({
        ...prev,
        ngo: donationId,
      }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        pickupComment: formData.pickup === "Could be improved" ? formData.pickupComment : "",
      };

      const res = await axios.post("http://localhost:8080/api/feedback/submit", payload);
      if (res.status === 201) {
        setSuccess("Feedback submitted successfully.");
        setFormData({
          ngo: formData.ngo,
          donor: donorId || null,
          ease: 3,
          pickup: "Yes",
          pickupComment: "",
          recommend: "Yes",
          improvement: "",
          rating: 3,
        });
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
<form
  onSubmit={handleSubmit}
  className="max-w-xl mx-auto p-6 bg-white text-black border border-gray-300 rounded-md"
>
  <h2 className="text-xl font-semibold mb-4">Submit Feedback</h2>

  {/* Ease of Process */}
  <label className="block mb-1">Ease of Process (1-5)</label>
  <input
    type="number"
    name="ease"
    min={1}
    max={5}
    value={formData.ease}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
    required
  />

  {/* Pickup Experience */}
  <label className="block mb-1">Pickup Experience</label>
  <select
    name="pickup"
    value={formData.pickup}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
    required
  >
    <option value="Yes">Yes</option>
    <option value="No">No</option>
    <option value="Could be improved">Could be improved</option>
  </select>

  {/* Pickup Comment */}
  {formData.pickup === "Could be improved" && (
    <>
      <label className="block mb-1">Pickup Comment</label>
      <input
        type="text"
        name="pickupComment"
        value={formData.pickupComment}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
      />
    </>
  )}

  {/* Recommendation */}
  <label className="block mb-1">Would you recommend us?</label>
  <select
    name="recommend"
    value={formData.recommend}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
    required
  >
    <option value="Yes">Yes</option>
    <option value="No">No</option>
    <option value="Not sure">Not sure</option>
  </select>

  {/* Suggestions */}
  <label className="block mb-1">Suggestions for Improvement</label>
  <textarea
    name="improvement"
    value={formData.improvement}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
    required
  />

  {/* Rating */}
  <label className="block mb-1">Overall Rating (1-5)</label>
  <input
    type="number"
    name="rating"
    min={1}
    max={5}
    value={formData.rating}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
    required
  />

  {/* Status Messages */}
  {error && <p className="text-red-600 mb-4">{error}</p>}
  {success && <p className="text-green-600 mb-4">{success}</p>}

  <button
    type="submit"
    className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
  >
    Submit Feedback
  </button>
</form>


  );
};

export default FeedbackForm;











// "use client";
// import { useState } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const FeedbackForm = () => {
//   const [formData, setFormData] = useState({
//     ease: '',
//     pickup: 'Yes',
//     pickupComment: '',
//     recommend: 'Yes',
//     improvement: '',
//     rating: ''
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const validateForm = () => {
//     const { ease, pickup, recommend, improvement, rating } = formData;

//     if (!ease || !recommend || !improvement || !rating) {
//       toast.error('Please fill in all required fields.');
//       return false;
//     }

//     const easeNum = Number(ease);
//     const ratingNum = Number(rating);

//     if (isNaN(easeNum) || easeNum < 1 || easeNum > 5) {
//       toast.error('Ease of Process must be a number between 1 and 5.');
//       return false;
//     }

//     if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
//       toast.error('Overall Rating must be a number between 1 and 5.');
//       return false;
//     }

//     if (pickup === 'Could be improved' && !formData.pickupComment.trim()) {
//       toast.error('Please provide a comment for pickup improvement.');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     // Simulate submission
//     toast.success('Feedback submitted successfully!');

//     // Clear form
//     setFormData({
//       ease: '',
//       pickup: 'Yes',
//       pickupComment: '',
//       recommend: 'Yes',
//       improvement: '',
//       rating: ''
//     });
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-white text-black border border-gray-300 rounded-md">
//       <h2 className="text-xl font-semibold mb-4">Submit Feedback</h2>

//       <form onSubmit={handleSubmit}>
//         <label className="block mb-1">Ease of Process (1-5)</label>
//         <input
//           type="number"
//           name="ease"
//           min={1}
//           max={5}
//           value={formData.ease}
//           onChange={handleChange}
//           className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
//           required
//         />

//         <label className="block mb-1">Pickup Experience</label>
//         <select
//           name="pickup"
//           value={formData.pickup}
//           onChange={handleChange}
//           className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
//           required
//         >
//           <option value="Yes">Yes</option>
//           <option value="No">No</option>
//           <option value="Could be improved">Could be improved</option>
//         </select>

//         {formData.pickup === 'Could be improved' && (
//           <>
//             <label className="block mb-1">Pickup Comment</label>
//             <input
//               type="text"
//               name="pickupComment"
//               value={formData.pickupComment}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
//               required
//             />
//           </>
//         )}

//         <label className="block mb-1">Would you recommend us?</label>
//         <select
//           name="recommend"
//           value={formData.recommend}
//           onChange={handleChange}
//           className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
//           required
//         >
//           <option value="Yes">Yes</option>
//           <option value="No">No</option>
//           <option value="Not sure">Not sure</option>
//         </select>

//         <label className="block mb-1">Suggestions for Improvement</label>
//         <textarea
//           name="improvement"
//           value={formData.improvement}
//           onChange={handleChange}
//           className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
//           required
//         />

//         <label className="block mb-1">Overall Rating (1-5)</label>
//         <input
//           type="number"
//           name="rating"
//           min={1}
//           max={5}
//           value={formData.rating}
//           onChange={handleChange}
//           className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
//           required
//         />

//         <button
//           type="submit"
//           className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
//         >
//           Submit Feedback
//         </button>
//       </form>

//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// };

// export default FeedbackForm;
