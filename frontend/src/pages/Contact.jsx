import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Contact() {
  const { user } = useAuth();
  const [form, setForm]       = useState({ name: user?.name || "", email: user?.email || "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // NOTE: This is a UI-only form. Wire up to your own email service
  // (e.g. Nodemailer endpoint, EmailJS, Resend) when ready.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    // Simulate send
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      {/* Info panel */}
      <div className="contact-info">
        <p className="section-eyebrow">Get in Touch</p>
        <h1 className="contact-info__title">We'd love to hear from you.</h1>
        <p className="contact-info__desc">
          Have feedback, a story idea, or just want to say hello?
          Send us a message and we'll get back to you.
        </p>

        <div className="contact-info__items">
          <div className="contact-info__item">
            <span className="contact-info__item-label">Platform</span>
            <span className="contact-info__item-value">BlogNest</span>
          </div>
          <div className="contact-info__item">
            <span className="contact-info__item-label">Response time</span>
            <span className="contact-info__item-value">Within 48 hours</span>
          </div>
          <div className="contact-info__item">
            <span className="contact-info__item-label">For writers</span>
            <span className="contact-info__item-value">Register as Admin to start publishing</span>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="contact-form-wrap">
        {submitted ? (
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", gap: "1rem" }}>
            <p style={{ fontSize: "2rem" }}>✓</p>
            <h2 className="text-serif" style={{ fontSize: "1.6rem", fontWeight: 600 }}>Message sent!</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Thank you, {form.name}. We'll be in touch soon.
            </p>
            <button className="btn btn--outline" style={{ marginTop: "1rem", alignSelf: "flex-start" }} onClick={() => setSubmitted(false)}>
              Send another
            </button>
          </div>
        ) : (
          <>
            <p className="section-eyebrow" style={{ marginBottom: "1.5rem" }}>Contact Form</p>
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input className="form-input" name="subject" value={form.subject} onChange={handleChange} placeholder="What's this about?" />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-textarea" name="message" value={form.message} onChange={handleChange} placeholder="Write your message here..." required style={{ minHeight: 180 }} />
              </div>

              <button className="btn btn--primary" type="submit" disabled={loading} style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}>
                {loading ? "Sending..." : "Send Message →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}