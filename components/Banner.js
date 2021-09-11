import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import LevelOne from "./MegaMenu.js/LevelOne";

// import Swiper core and required modules
import SwiperCore, { Pagination, Navigation } from "swiper";

SwiperCore.use([Pagination, Navigation]);

const Banner = ({ categories }) => {
  return (
    <section className="section-content py-5">
      <div className="row">
        <aside className="col-lg-3 d-sm-none">
          <nav className="sidebar card box-shadow">
            <LevelOne categories={categories} />
          </nav>
        </aside>
        <main className="col-lg-9">
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            pagination={{
              type: "progressbar",
            }}
            navigation={true}
            className="mySwiper"
          >
            <SwiperSlide>
              <img src="./images/banner/banner.jpg" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="./images/banner/banner1.png" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="./images/banner/banner2.png" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="./images/banner/banner3.png" />
            </SwiperSlide>
          </Swiper>
        </main>
      </div>
    </section>
  );
};

export default Banner;
