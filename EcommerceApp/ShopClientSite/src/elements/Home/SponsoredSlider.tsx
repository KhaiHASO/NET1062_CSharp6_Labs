
import {Swiper, SwiperSlide } from "swiper/react";
import {motion} from 'framer-motion';
import { SponsoredSliderData } from "../../constant/Alldata";

const SponsoredSlider = () => {
    return (
        <Swiper 
            slidesPerView = {4}
            spaceBetween = {30}
            loop = {true}            
            breakpoints= {{
                1200: {
                    slidesPerView: 4,
                },
                991: {
                    slidesPerView: 3,
                },
                767: {
                    slidesPerView: 2,
                },
                575: {
                    slidesPerView: 1.5,
                },
                340: {
                    slidesPerView: 1,
                    centeredSlides: true,
                },
            }}
            className="swiper swiper-company"
        >            
            {SponsoredSliderData.map((item, i)=>(
                <SwiperSlide key={i}>
                    <motion.div className="company-box style-1" 
                        animate={{ y : '50%'}}
                        whileInView={{y : 0}}
                        transition={{duration: item.time}}
                    >
                        <div className="dz-media">
                            <img src={item.image} alt="" className="company-img" />
                            <img src={item.image2} alt="" className="logo" />
                            {item.store === "store" ? 
                                <span className="sale-badge">in Store</span>
                                :
                                ''
                            }
                        </div>
                        <div className="dz-content">
                            <h6 className="title">Outdoor Shoes	</h6>
                            <span className="sale-title">Min. 30% Off</span>
                        </div>		
                    </motion.div>
                </SwiperSlide>
            ))}                
        </Swiper>
    );
};

export default SponsoredSlider;