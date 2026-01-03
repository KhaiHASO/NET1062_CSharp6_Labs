import { Link } from "react-router-dom";
import IMAGES from "../constant/theme";


interface propsValue {
    name : string
    image :  string
    star?:  string
}

const SaleDiscountShopCard = ({name, image, star} : propsValue) => {
    return (
        <div className="shop-card style-3">
            <div className="dz-media">
                <img src={image} alt="shop-1" />
            </div>
            <div className="dz-content">
                <div>
                    <span className="sale-title">up to 79% off</span>
                    <h6 className="title"><Link to="/shop-list">{name}</Link></h6>
                </div>
                <h6 className="price">
                    $80
                    <del>$95</del>
                </h6>
            </div>
            {
                star === "star" ? <span className="sale-badge">50%<br />Sale <img src={IMAGES.starpng} alt="" /></span> : ''
            }
                
        </div>
    );
};

export default SaleDiscountShopCard;