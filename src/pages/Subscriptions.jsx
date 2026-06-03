import { useState } from "react";
import axios from "axios";
import CmsPage from "./CmsPage";
import { env } from "../config";

const options = [
  { value: "blogs", label: "Blogs", description: "New blog posts and articles" },
  { value: "events", label: "Events", description: "Event and festival updates" },
  { value: "maps", label: "Maps", description: "New map drops and route updates" },
];

const Subscriptions = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    preference: "events",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      await axios.post(`${env.baseUrl}/api/newsletter/subscribe`, {
        name: form.name,
        email: form.email,
        preference: form.preference,
        preferences: [form.preference],
        source: "subscriptions-page",
      });

      setStatus({
        type: "success",
        message: "You’re subscribed. We’ve saved your preference.",
      });
      setForm({ name: "", email: "", preference: "events" });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "We couldn’t save the subscription right now.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CmsPage slug="subscriptions" titleFallback="Subscriptions">
      <section className="subscription-form-shell">
        <div className="container">
          <form className="subscription-form" onSubmit={submit}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label htmlFor="subscriber-name">Name</label>
                  <input
                    id="subscriber-name"
                    className="form-control"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Your name"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label htmlFor="subscriber-email">Email</label>
                  <input
                    id="subscriber-email"
                    type="email"
                    className="form-control"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="row g-3">
              {options.map((option) => (
                <div className="col-md-4" key={option.value}>
                  <label className="option-card w-100">
                    <input
                      type="radio"
                      name="preference"
                      checked={form.preference === option.value}
                      onChange={() =>
                        setForm((prev) => ({ ...prev, preference: option.value }))
                      }
                    />
                    <div>
                      <h3>{option.label}</h3>
                      <p>{option.description}</p>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-4 d-flex align-items-center gap-3">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Submitting..." : "Subscribe"}
              </button>
              {status.message ? (
                <p className={status.type === "error" ? "text-danger mb-0" : "text-success mb-0"}>
                  {status.message}
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </section>
    </CmsPage>
  );
};

export default Subscriptions;
