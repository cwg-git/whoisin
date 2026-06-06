import { useState } from "react";
import axios from "axios";
import { env } from "../config";
import icon1 from "../images/subscriptions-icon1.png";
import icon2 from "../images/subscriptions-icon2.png";
import icon3 from "../images/subscriptions-icon3.png";
import icon4 from "../images/subscriptions-icon4.png";
import icon5 from "../images/subscriptions-icon5.png";
import icon6 from "../images/subscriptions-icon6.png";
import icon7 from "../images/subscriptions-icon7.png";

const options = [
  {
    value: "blogs",
    title: "Blogs",
    description: "New blog posts and articles",
    icon: icon1,
  },
  {
    value: "events",
    title: "Events",
    description: "Upcoming events and announcements",
    icon: icon2,
  },
  {
    value: "both",
    title: "Both Blogs & Events",
    description: "Receive all updates and notifications",
    icon: icon3,
  },
];

const whySubscribeFeatures = [
  {
    id: 1,
    icon: icon4,
    title: "Instant Notifications",
    description: "Be the first to know about new content, updates, and announcements."
  },
  {
    id: 2,
    icon: icon5,
    title: "Event Reminders",
    description: "Never miss important events, webinars, or upcoming activities."
  },
  {
    id: 3,
    icon: icon6,
    title: "Latest Blog Updates",
    description: "Receive our newest articles and insights delivered directly to you."
  },
  {
    id: 4,
    icon: icon7,
    title: "Easy Management",
    description: "Update your preferences or unsubscribe anytime with one click."
  }
];

const Subscriptions = () => {
  const [form, setForm] = useState({
    email: "",
    preference: "both",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      await axios.post(`${env.baseUrl}/api/newsletter/subscribe`, {
        email: form.email,
        preference: form.preference,
        preferences: [form.preference],
        source: "subscriptions-page",
      });

      setStatus({
        type: "success",
        message: "You're subscribed. We've saved your preference.",
      });
      setForm({ email: "", preference: "both" });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "We couldn't save the subscription right now.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="inner-banner">
        <div className="container">
          <div className="text-block">
            <h3>
              <em>Stay</em>
            </h3>
            <h1>
              <em>Updated</em>
            </h1>
          </div>
        </div>
      </section>

      <section className="subscription-section">
        <div className="container">
          <div className="subscription-box">
            <div className="row">
              <div className="col-md-6">
                <div className="subscription-left">
                  <h2>1. Choose Your Preferences</h2>
                  <h4>I want to receive updates about:</h4>

                  <div>
                    {options.map((option) => {
                      const isSelected = form.preference === option.value;

                      return (
                        <label
                          key={option.value}
                          className={`option-card${isSelected ? " active" : ""}`}
                        >
                          <input
                            type="radio"
                            name="subscription"
                            checked={isSelected}
                            onChange={() =>
                              setForm((prev) => ({ ...prev, preference: option.value }))
                            }
                          />
                          <div className="icon">
                            <img src={option.icon} alt={option.title} width="54" height="54" />
                          </div>
                          <div>
                            <h3>{option.title}</h3>
                            <p>{option.description}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="subscription-right">
                  <h2>2. Choose How You'd Like to Sign Up</h2>

                  <form onSubmit={submit}>
                    <div className="form-group">
                      <label htmlFor="subscriber-email">Continue with email</label>
                      <input
                        id="subscriber-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, email: event.target.value }))
                        }
                        placeholder="Enter your email address"
                        className="form-control"
                      />
                    </div>

                    <button
                      type="submit"
                      className="subscribe-btn btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Subscribe Now"}
                    </button>

                    <div className="privacy">
                      <div className="privacy-icon">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M12 2L4 5V11C4 16.5 7.8 21.4 12 22C16.2 21.4 20 16.5 20 11V5L12 2Z"
                            stroke="#db7521"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9.5 12L11.5 14L15 10.5"
                            stroke="#db7521"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="privacy-content">
                        <p>
                          We respect your privacy. Your information will never be shared with
                          third parties. You can unsubscribe at any time with a single click.
                        </p>
                      </div>
                    </div>

                    {status.message ? (
                      <p className={status.type === "error" ? "text-danger" : "text-success"}>
                        {status.message}
                      </p>
                    ) : null}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Subscribe Section - Added Here */}
      <section className="why-subscribe py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Why Subscribe?</h2>
            <p className="text-muted">
              Get valuable updates, reminders, and exclusive content directly in your inbox.
            </p>
          </div>

          <div className="row g-4">
            {whySubscribeFeatures.map((feature) => (
              <div key={feature.id} className="col-lg-3 col-md-6">
                <div className="why-box text-center h-100">
                  <div className="icon-box mb-4">
                    <img 
                      src={feature.icon} 
                      alt={feature.title}
                      width="64"
                      height="64"
                    />
                  </div>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Subscriptions;