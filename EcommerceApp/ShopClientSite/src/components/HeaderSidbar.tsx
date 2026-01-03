import { Link } from "react-router-dom";
import ShopSidebar from "../elements/Shop/ShopSidebar";

export default function HeaderSidbar(){
    return(
        <div className="product-description">          
            <ShopSidebar />
            <Link to="#" className="btn btn-sm font-14 btn-secondary btn-sharp">RESET</Link>
        </div>
    )
}