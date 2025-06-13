import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import "./Feedback.css";

function Feedback() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const feedbackInfo = {
      access_key: "42ffeec6-a5e6-466a-aa53-d6c7ad2421c8",
      blog_name: data.blogName,
      creator_name: data.creatorName,
      feedback: data.feedback,
      subject: "Feedback Form Submission",
      from_name: "Feedback Form from BlogNest",
    };
    try {
      await axios.post("https://api.web3forms.com/submit", feedbackInfo);
      toast.success("Thank you for your feedback!");
      reset();
    } catch (error) {
      toast.error("Failed to send feedback. Please try again.");
    }
  };

  return (
    <div className="feedback-container">
      <div className="feedback-header">
        <h2>We Appreciate Your Feedback</h2>
        <p>Your feedback helps us grow and improve BlogNest.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="feedback-form">
        <div className="form-group">
          <label htmlFor="blogName">Blog Name</label>
          <input
            id="blogName"
            type="text"
            {...register("blogName", { required: true })}
            placeholder="Enter the blog name"
            className={errors.blogName ? "error-input" : ""}
          />
          {errors.blogName && (
            <span className="error-message">Blog name is required</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="creatorName">Creator Name</label>
          <input
            id="creatorName"
            type="text"
            {...register("creatorName", { required: true })}
            placeholder="Enter creator's name"
            className={errors.creatorName ? "error-input" : ""}
          />
          {errors.creatorName && (
            <span className="error-message">Creator name is required</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="feedback">Feedback</label>
          <textarea
            id="feedback"
            {...register("feedback", { required: true })}
            placeholder="Share your feedback..."
            className={errors.feedback ? "error-input" : ""}
            rows={5}
          />
          {errors.feedback && (
            <span className="error-message">Feedback is required</span>
          )}
        </div>
        <button type="submit" className="submit-btn">
          Submit Feedback
        </button>
      </form>
    </div>
  );
}

export default Feedback;
