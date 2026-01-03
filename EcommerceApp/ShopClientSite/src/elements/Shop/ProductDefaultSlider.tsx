import { Link } from "react-router-dom";
import IMAGES from "../../constant/theme";
import { Swiper,SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import { useState } from "react";
import LightGallery from 'lightgallery/react';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

export default function ProductDefaultSlider(){
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    return(
        <div className="swiper-btn-center-lr">
            <LightGallery 
                plugins={[lgThumbnail, lgZoom]}
                selector={'.DZoomImage'}
            >
                <Swiper className="product-gallery-swiper2 rounded"
                    spaceBetween= {0}
                    updateOnWindowResize = {true}                
                    thumbs={{ swiper: thumbsSwiper }}
                    modules={[Thumbs]}
                >                
                    <SwiperSlide>
                        <div className="dz-media">
                            <Link className="mfp-link lg-item DZoomImage" to={IMAGES.productdetail2png1} data-src={IMAGES.productdetail2png1}>
                                <i className="feather icon-maximize dz-maximize top-left"/>
                                <img src={IMAGES.productdetail2png1} alt="" className=" d-none"/> 
                            </Link>
                            <img src={IMAGES.productdetail2png1} alt="product" />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="dz-media">
                            <Link className="mfp-link lg-item DZoomImage" to={IMAGES.productdetail2png2} data-src={IMAGES.productdetail2png2}>
                                <i className="feather icon-maximize dz-maximize top-left"/>
                                <img src={IMAGES.productdetail2png2} alt="" className=" d-none"/> 
                            </Link>
                            <img src={IMAGES.productdetail2png2} alt="product" />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="dz-media">
                            <Link className="mfp-link lg-item DZoomImage" to={IMAGES.productdetail2png3} data-src={IMAGES.productdetail2png3}>
                                <i className="feather icon-maximize dz-maximize top-left"/>
                                <img src={IMAGES.productdetail2png3} alt="" className=" d-none"/> 
                            </Link>
                            <img src={IMAGES.productdetail2png3} alt="product" />
                        </div>
                    </SwiperSlide>
                    
                </Swiper>
            </LightGallery>
            <Swiper className="product-gallery-swiper thumb-swiper-lg"
                spaceBetween= {10}                
				slidesPerView = {2}				
                // @ts-ignore
                onSwiper={setThumbsSwiper}
                modules={[Thumbs]}
				
            >                
                <SwiperSlide>
                    <img src={IMAGES.productdetail2thumbpng1} alt="product" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={IMAGES.productdetail2thumbpng2} alt="product" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={IMAGES.productdetail2thumbpng3} alt="product" />
                </SwiperSlide>                
            </Swiper>
        </div>	
    )
}