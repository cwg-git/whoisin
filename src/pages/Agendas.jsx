import React from 'react';
import Categories from '../components/Categories';
const Agendas = () => {
    return (
        <div>
            <section className="inner-banner">
                <div className="container">
                    <div className="text-block">
                        <h3><em>Our</em></h3>
                        <h1><em>Agendas</em></h1>
                    </div>
                </div>
            </section>
            <Categories type="posts" />
            <Categories type="events" />
        </div>

    );
};
export default Agendas;
