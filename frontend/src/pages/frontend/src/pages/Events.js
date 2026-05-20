import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

function Events() {

  const API =
    "https://afm-backend.onrender.com";

  const token =
    localStorage.getItem(
      "token"
    );

  const authHeaders = {

    headers: {

      Authorization:
        `Bearer ${token}`

    }

  };

  // ================= STATES =================

  const [events, setEvents] =
    useState([]);

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [eventDate, setEventDate] =
    useState("");

  // ================= FETCH EVENTS =================

  const fetchEvents = async () => {

    try {

      const response =
        await axios.get(

          `${API}/events`,

          authHeaders

        );

      setEvents(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  // ================= ADD EVENT =================

  const addEvent = async () => {

    if (

      !title ||
      !description ||
      !eventDate

    ) {

      alert(
        "Fill all fields"
      );

      return;

    }

    try {

      await axios.post(

        `${API}/add_event`,

        {

          title,
          description,
          event_date: eventDate

        },

        authHeaders

      );

      alert(
        "Event added successfully"
      );

      setTitle("");
      setDescription("");
      setEventDate("");

      fetchEvents();

    } catch (error) {

      console.log(error);

      alert(
        "Failed to add event"
      );

    }

  };

  useEffect(() => {

    fetchEvents();

  }, []);

  return (

    <div>

      {/* ================= EVENT FORM ================= */}

      <div className="settings-box">

        <h2>
          Church Events
        </h2>

        <input

          type="text"

          placeholder="Event Title"

          value={title}

          onChange={(e) =>

            setTitle(
              e.target.value
            )

          }

        />

        <textarea

          placeholder="Event Description"

          value={description}

          onChange={(e) =>

            setDescription(
              e.target.value
            )

          }

        />

        <input

          type="date"

          value={eventDate}

          onChange={(e) =>

            setEventDate(
              e.target.value
            )

          }

        />

        <br />
        <br />

        <button
          onClick={addEvent}
        >
          Add Event
        </button>

      </div>

      {/* ================= EVENTS LIST ================= */}

      <div className="settings-box">

        <h2>
          Upcoming Events
        </h2>

        {events.map((event) => (

          <div
            className="member-card"
            key={event.id}
          >

            <h3>
              {event.title}
            </h3>

            <p>
              {event.description}
            </p>

            <p>

              <strong>
                Date:
              </strong>

              {" "}

              {event.event_date}

            </p>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Events;