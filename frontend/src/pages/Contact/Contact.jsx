import React from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import "./Contact.css";

function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const userInfo = {
      access_key: "42ffeec6-a5e6-466a-aa53-d6c7ad2421c8",
      name: data.username,
      email: data.email,
      message: data.message,
      subject: "Contact Form Submission",
      from_name: "Contact Form from BlogNest",
    };
    try {
      await axios.post("https://api.web3forms.com/submit", userInfo);
      toast.success("Message sent successfully");
      reset(); 
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="contact-bg">
      <div className="contact-container">
        <div className="contact-title">
          <h2>Contact Us</h2>
        </div>
        <div className="contact-flex">
          <div className="contact-form-section">
            <h3>Send us a message</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
              <div className="contact-field">
                <input
                  type="text"
                  name="username"
                  placeholder="Your Name"
                  className="contact-input"
                  {...register("username", { required: true })}
                />
                {errors.username && (
                  <span className="contact-error">
                    This field is required
                  </span>
                )}
              </div>
              <div className="contact-field">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="contact-input"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <span className="contact-error">
                    This field is required
                  </span>
                )}
              </div>
              <div className="contact-field">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  className="contact-textarea"
                  {...register("message", { required: true })}
                />
                {errors.message && (
                  <span className="contact-error">
                    This field is required
                  </span>
                )}
              </div>
              <div>
                <button type="submit" className="contact-submit-btn">
                  Send Message
                </button>
              </div>
            </form>
          </div>
          <div className="contact-info-section">
            <h3>Contact Information</h3>
            <ul className="contact-info-list">
              <li>
                <FaPhone className="contact-icon phone" />
                <span>+91 9718047132</span>
              </li>
              <li>
                <FaEnvelope className="contact-icon envelope" />
                <span>raiurza@gmail.com</span>
              </li>
              <li>
                <FaMapMarkerAlt className="contact-icon map" />
                <span>Pune, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
