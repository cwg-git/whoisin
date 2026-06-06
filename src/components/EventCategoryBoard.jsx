import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { PiCaretLeft, PiCaretRight, PiClock, PiFolderSimple } from "react-icons/pi";
import { env } from "../config";

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getWeekStart = (date) => {
  const current = new Date(date);
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(current.setDate(diff));
};

const getWeekDays = (start) =>
  Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });

const EventCategoryBoard = ({ mode = "day" }) => {
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    getWeekStart(new Date())
  );

  const isWeekMode = mode === "week";
  const isDayMode = mode === "day";

  useEffect(() => {
    axios
      .get(`${env.baseUrl}/api/categories/events`)
      .then((response) => setCategories(response.data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (isDayMode) {
          const date = formatLocalDate(currentDate);
          const response = await axios.get(`${env.baseUrl}/api/posts/day?date=${date}`);
          setEvents(response.data.events || response.data.data || []);
          return;
        }

        const start = formatLocalDate(currentWeekStart);
        const end = formatLocalDate(new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), currentWeekStart.getDate() + 6));
        const response = await axios.get(
          `${env.baseUrl}/api/posts/week?start_date=${start}&end_date=${end}`
        );
        setEvents(response.data.events || response.data.data || []);
      } catch (error) {
        setEvents([]);
      }
    };

    fetchEvents();
  }, [currentDate, currentWeekStart, isDayMode, isWeekMode]);

  const groupedEvents = useMemo(() => {
    const buckets = new Map();

    categories.forEach((category) => {
      const key = normalize(category.slugurl || category.slug || category.name || category.id);
      buckets.set(key, { category, events: [] });
    });

    events.forEach((event) => {
      const candidates = [
        event.category_slugurl,
        event.category_slug,
        event.category_name,
        event.category,
        event.category_id,
        event.categoryLabel,
      ]
        .filter(Boolean)
        .map(normalize);

      const matchedCategory = categories.find((category) => {
        const categoryCandidates = [
          category.id,
          category.slugurl,
          category.slug,
          category.name,
        ]
          .filter(Boolean)
          .map(normalize);

        return candidates.some((candidate) => categoryCandidates.includes(candidate));
      });

      const key = normalize(
        matchedCategory?.slugurl ||
          matchedCategory?.slug ||
          matchedCategory?.name ||
          matchedCategory?.id ||
          event.category_id ||
          event.category ||
          "uncategorized"
      );

      if (!buckets.has(key)) {
        buckets.set(key, {
          category: matchedCategory || {
            id: key,
            name: event.category_id || event.category || "Uncategorized",
            slugurl: key,
          },
          events: [],
        });
      }

      buckets.get(key).events.push(event);
    });

    return Array.from(buckets.values());
  }, [categories, events]);

  const weekDays = useMemo(
    () => getWeekDays(currentWeekStart),
    [currentWeekStart]
  );

  const getEventKey = (event, index) =>
    `${event.id || event.slug || event.title || "event"}-${index}`;

  const getEventHref = (event) => event.link || `/event/${event.slug}`;

  const renderEventCard = (event, compact = false) => (
    <a
      key={event.id || event.slug}
      href={getEventHref(event)}
      target={event.link ? "_blank" : "_self"}
      rel={event.link ? "noopener noreferrer" : undefined}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <article
        style={{
          display: "grid",
          gridTemplateColumns: compact ? "1fr" : "88px 1fr",
          gap: 12,
          alignItems: "start",
          background: "#fff",
          border: "1px solid rgba(15, 23, 42, 0.08)",
          borderRadius: 16,
          padding: compact ? "12px" : "14px",
          height: "100%",
        }}
      >
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            style={{
              width: compact ? "100%" : 88,
              height: compact ? 110 : 88,
              objectFit: "cover",
              borderRadius: 12,
            }}
          />
        ) : null}

        <div>
          <div
            style={{
              fontSize: 12,
              color: "#475569",
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 6,
            }}
          >
            <PiClock size={14} />
            {event.time || event.start_time || "All Day"}
          </div>
          <h5 style={{ margin: "0 0 8px", lineHeight: 1.35 }}>{event.title}</h5>
          {event.location ? (
            <div style={{ fontSize: 13, color: "#64748b" }}>{event.location}</div>
          ) : null}
        </div>
      </article>
    </a>
  );

  if (isDayMode) {
    const todayLabel = currentDate.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    return (
      <section className="container" style={{ paddingTop: 12, paddingBottom: 40 }}>
        <div
          style={{
            display: "flex",
            alignItems: "end",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          <div>
            <h2 style={{ marginBottom: 8 }}>Live events of today</h2>
            <p style={{ margin: 0, color: "#64748b" }}>
              {todayLabel} • one category per line
            </p>
          </div>
          <span
            style={{
              background: "#0f172a",
              color: "#fff",
              borderRadius: 999,
              padding: "8px 12px",
              fontSize: 12,
            }}
          >
            {groupedEvents.reduce((total, row) => total + row.events.length, 0)} events
          </span>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          {groupedEvents.map((row) => (
            <div
              key={row.category.id || row.category.slugurl || row.category.name}
              style={{
                display: "grid",
                gridTemplateColumns: "180px minmax(0, 1fr)",
                gap: 14,
                alignItems: "start",
                background: "#f8fafc",
                borderRadius: 18,
                padding: 14,
                border: "1px solid rgba(15, 23, 42, 0.06)",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <PiFolderSimple size={18} />
                  <strong>{row.category.name}</strong>
                </div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  {row.events.length} event{row.events.length === 1 ? "" : "s"}
                </div>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {row.events.length > 0 ? (
                  row.events.map((event, index) => renderEventCard(event, false))
                ) : (
                  <div
                    style={{
                      padding: "18px 16px",
                      borderRadius: 14,
                      background: "#fff",
                      border: "1px dashed rgba(15, 23, 42, 0.14)",
                      color: "#64748b",
                    }}
                  >
                    No events today in this category.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const handlePrevWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() - 7);
    setCurrentWeekStart(getWeekStart(next));
  };

  const handleNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(getWeekStart(next));
  };

  const weekLabel = `${weekDays[0].toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })} - ${weekDays[6].toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

  return (
    <section className="container" style={{ paddingTop: 12, paddingBottom: 40 }}>
      <div
        style={{
          display: "flex",
          alignItems: "end",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ marginBottom: 8 }}>This week by category</h2>
          <p style={{ margin: 0, color: "#64748b" }}>
            The full week is shown visually for each category.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={handlePrevWeek}
            style={{
              border: "1px solid rgba(15, 23, 42, 0.12)",
              background: "#fff",
              borderRadius: 999,
              width: 42,
              height: 42,
              display: "grid",
              placeItems: "center",
            }}
          >
            <PiCaretLeft size={18} />
          </button>
          <div
            style={{
              borderRadius: 999,
              padding: "10px 14px",
              background: "#0f172a",
              color: "#fff",
              fontSize: 13,
            }}
          >
            {weekLabel}
          </div>
          <button
            type="button"
            onClick={handleNextWeek}
            style={{
              border: "1px solid rgba(15, 23, 42, 0.12)",
              background: "#fff",
              borderRadius: 999,
              width: 42,
              height: 42,
              display: "grid",
              placeItems: "center",
            }}
          >
            <PiCaretRight size={18} />
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gap: 14 }}>
        {groupedEvents.map((row) => (
          <section
            key={row.category.id || row.category.slugurl || row.category.name}
            style={{
              borderRadius: 20,
              border: "1px solid rgba(15, 23, 42, 0.08)",
              background: "#f8fafc",
              padding: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
                marginBottom: 14,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <PiFolderSimple size={18} />
                  <h3 style={{ margin: 0 }}>{row.category.name}</h3>
                </div>
                <p style={{ margin: "6px 0 0", color: "#64748b" }}>
                  {row.events.length} event{row.events.length === 1 ? "" : "s"} this week
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, minmax(160px, 1fr))",
                gap: 12,
                overflowX: "auto",
                paddingBottom: 4,
              }}
            >
              {weekDays.map((day) => {
                const dayKey = formatLocalDate(day);
                const dayEvents = row.events.filter((event) => {
                  const eventDate = dayjs(
                    event.start_date || event.post_date || event.date || event.startDate
                  ).format("YYYY-MM-DD");
                  return eventDate === dayKey;
                });

                return (
                  <div
                    key={`${row.category.name}-${dayKey}`}
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      border: "1px solid rgba(15, 23, 42, 0.08)",
                      padding: 12,
                      minHeight: 160,
                    }}
                  >
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        {day.toLocaleDateString(undefined, { weekday: "short" })}
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 700 }}>{day.getDate()}</div>
                    </div>

                    <div style={{ display: "grid", gap: 10 }}>
                      {dayEvents.length > 0 ? (
                        dayEvents.map((event, index) => (
                          <div key={getEventKey(event, index)}>{renderEventCard(event, true)}</div>
                        ))
                      ) : (
                        <div
                          style={{
                            color: "#94a3b8",
                            fontSize: 13,
                            border: "1px dashed rgba(148, 163, 184, 0.45)",
                            borderRadius: 12,
                            padding: "14px 10px",
                            textAlign: "center",
                          }}
                        >
                          No events
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
};

export default EventCategoryBoard;
