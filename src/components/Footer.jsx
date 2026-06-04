import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-12 our-links">
            <h3>Enlaces</h3>
            <ul>
              <li><a href="/">Hola Barcelona</a></li>
              <li><a href="/today">Today</a></li>
              <li><a href="/this-week">This week</a></li>
              <li><a href="/agendas">Agenda</a></li>
              <li><a href="/fiestas-mayor">Fiestas Mayor</a></li>
              <li><a href="/festivales">Festivales</a></li>
              <li><a href="/categories">Categorías</a></li>
              <li><a href="/subscriptions">Suscripciones</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="bottom-block d-flex justify-content-between">
          <p>© Whoisinbcn.com</p>
          <a href="/subscriptions">Suscripciones</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
