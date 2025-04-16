const getTestimonials = (req, res) => {
  // Mock data for testimonials
  const testimonials = [
    { id: 1, text: "This platform is amazing!", author: "Alice" },
    { id: 2, text: "I love how easy it is to donate.", author: "Bob" },
    { id: 3, text: "A great way to help the community.", author: "Charlie" },
  ];

  res.status(200).json(testimonials);
};

const addTestimonial = (req, res) => {
  const { text, author } = req.body;

  if (!text || !author) {
    return res.status(400).json({ error: "Text and author are required." });
  }

  // Mock saving the testimonial (replace with database logic)
  const newTestimonial = { id: Date.now(), text, author };

  res.status(201).json({ message: "Testimonial added successfully.", testimonial: newTestimonial });
};

module.exports = { getTestimonials, addTestimonial };