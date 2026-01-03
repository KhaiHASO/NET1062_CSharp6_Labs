import { Link } from "react-router-dom";
import IMAGES, { SVGICON } from "../../constant/theme";
import HottestSliderBlog from "./HottestSliderBlog";

const hottestBlogMap = [
    {image: IMAGES.productmedium3, title:'Cozy Knit Cardigan Sweater', design:'area-box1'},
    {image: IMAGES.productmedium4, title:'Sophisticated Swagger Suit', design:'area-box2'},
    {image: IMAGES.productmedium5, title:'Classic Denim Skinny Jeans', design:'area-box3'},
];

const HottestBlog = () => {
    return (      
        <div className="row align-items-start">
            <div className="col-xl-7 col-lg-12 col-md-12">
                <div className="map-area">
                    <img src={IMAGES.map2} alt="product" />
                    <div className="map-line" id="map-line"><img src={IMAGES.mapline} alt="product" /></div>
                    <div className="loction-b" dangerouslySetInnerHTML={{__html : SVGICON.locationSvgB}}></div>
                    <div className="loction-center" dangerouslySetInnerHTML={{__html : SVGICON.KiloMeterSvg}} ></div>
                    <div className="loction-a" dangerouslySetInnerHTML={{__html : SVGICON.locationSvgA}}></div>
                    {hottestBlogMap.map((item, i)=>(
                        <div className={`animated ${item.design}`} key={i}>
                            <div className="shop-card style-7">
                                <div className="dz-media">
                                    <img src={item.image} alt="product" />
                                </div>
                                <div className="dz-content">
                                    <h5 className="title"><Link to="/shop-list">{item.title}</Link></h5>
                                    <span className="sale-title">up to 79% off</span>
                                </div>
                            </div>	
                        </div>	
                    ))}                   
                </div>
            </div>	
            <div className="col-xl-5 col-lg-12 col-md-12 custom-width">
                <div className="section-head style-1 d-lg-flex align-items-end justify-content-between">
                    <div className="left-content">
                        <h2 className="title">Discovering the Hottest Nearby Destinations in Your Area</h2>
                        <p className="text-capitalize text-secondary m-0">Up to 60% off + up to $107 cashBACK</p>
                    </div>
                    <Link to="/shop-list" className="text-secondary font-14 d-flex align-items-center gap-1 m-b15">See All 
                        <i className="icon feather icon-chevron-right font-18" />
                    </Link>			
                </div>
                <HottestSliderBlog />
            </div>
        </div>				
    );
};

export default HottestBlog;