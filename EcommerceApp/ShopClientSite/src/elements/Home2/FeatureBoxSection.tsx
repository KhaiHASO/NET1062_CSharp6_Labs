import { Link } from "react-router-dom";
import IMAGES from "../../constant/theme";
import { FeatureBoxBlog } from "../../constant/Alldata";

export default function FeatureBoxSection(){
    return(
        <div className="row gx-0">
            {FeatureBoxBlog.map((elem, index)=>(
                <div className="col-xl-2 col-lg-4 col-md-4 col-sm-4 col-4 wow fadeIn" data-wow-delay="0.1s" key={index}>
                    <div className="insta-post dz-media dz-img-effect rotate">
                        <Link to="/portfolio-tiles">
                            <img src={elem.image} alt="feature" />
                        </Link>
                    </div>
                </div>
            ))}            
            <Link to="https://www.instagram.com/dexignzone/" className="instagram-link">
                <div className="follow-link  wow bounceIn" data-wow-delay="0.1s">
                    <div className="follow-link-icon">
                        <img src={IMAGES.InstaFollow} alt="follow" />
                    </div>
                    <div className="follow-link-content">
                        <p className="m-0">Follow @Pixio</p>
                    </div>
                </div>
            </Link>
        </div>
    )
}