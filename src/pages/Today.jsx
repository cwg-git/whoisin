import React from "react";
import TodayCalender from "./TodayCalender";

const Today = () => {
  return (
    <div>
      <section className="inner-banner">
        <div className="container">
          <div className="text-block">
            <h3>
              <em>Eventos</em>
            </h3>
            <h1>
              <em>Hoy</em>
            </h1>
          </div>
        </div>
      </section>

      <TodayCalender />
    </div>
  );
};

export default Today;
