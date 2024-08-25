import React, { useEffect, useState, useRef } from "react";
import Reservation_add from "./Reservation_add";
import InfiniteScroll from "./InfiniteScroll";
import './CSS/Parallax.css';
const VITE_API_URL = import.meta.env.VITE_API_URL; // Use a config file or similar for env variables

const Parallax = () => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const onScroll = () => setOffset(window.pageYOffset);
        // การจับเหตุการณ์ scroll
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return (
        <div>
            <div className="hidden md:block">
                <header>
                    <h1 className="big-title" style={{ transform: `translateY(${offset * 0.1}px)` }}>อู่นพดลการช่าง</h1>
                    <img src="src/assets/person.png" className="person translate" style={{ transform: `translateY(${offset * -0.25}px)` }} alt="" />
                    <img src="src/assets/mountain1.png" className="mountain1 translate" style={{ transform: `translateY(${offset * -0.2}px)` }} alt="" />
                    <img src="src/assets/mountain2.png" className="mountain2 translate" style={{ transform: `translateY(${offset * 0.3}px)` }} alt="" />
                    {/* <img src="src/assets/mountain3.png" className="mountain3 translate" style={{ transform: `translateY(${offset * 0.3}px)` }} alt=""/> */}
                    <img src="src/assets/sky.png" className="sky translate" style={{ transform: `translateY(${offset * 0.5}px)` }} alt="" />
                    <InfiniteScroll />
                </header>
            </div>
        </div>
    );
}

export default Parallax;