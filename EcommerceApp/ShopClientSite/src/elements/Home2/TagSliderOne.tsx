import { Fragment } from "react/jsx-runtime";
import IMAGES from "../../constant/theme";
import { Link } from "react-router-dom";
interface CompaniesLogoType {
    image: string;
}

const CompaniesLogoData : CompaniesLogoType[] = [
    { image : IMAGES.CompanyPngLogo1},
    { image : IMAGES.CompanyPngLogo2},
    { image : IMAGES.CompanyPngLogo3},
    { image : IMAGES.CompanyPngLogo4},
    { image : IMAGES.CompanyPngLogo5},
    { image : IMAGES.CompanyPngLogo6},
    { image : IMAGES.CompanyPngLogo7},
    { image : IMAGES.CompanyPngLogo1},
    { image : IMAGES.CompanyPngLogo2},
    { image : IMAGES.CompanyPngLogo8},
    { image : IMAGES.CompanyPngLogo3},
    { image : IMAGES.CompanyPngLogo4},
    { image : IMAGES.CompanyPngLogo6},
    { image : IMAGES.CompanyPngLogo7},
    { image : IMAGES.CompanyPngLogo1},
    { image : IMAGES.CompanyPngLogo2},
    { image : IMAGES.CompanyPngLogo8},
];


function TagSliderOne(){        
    return(
        <Fragment>            
            <div className="item-wrap tag-features">	
                {CompaniesLogoData.map(({image}, i)=>(
                    <div className="item" key={i}>
                        <Link to={"#"} className="companies-wrapper">
                            <div className="companies-media">
                                <img src={image} alt="brand"/> 
                            </div>
                        </Link>
                    </div>
                ))}                   
            </div>
            
        </Fragment>
    )
}

function TagSliderTwo(){    
    return(
        <div className="item-wrap tag-features2">	
            {CompaniesLogoData.map(({image}, i)=>(
                <div className="item" key={i}>
                    <Link to={"#"} className="companies-wrapper">
                        <div className="companies-media">
                            <img src={image} alt="brand"/> 
                        </div>
                    </Link>
                </div>
            ))}                   
        </div>
    )
}

export {TagSliderOne, TagSliderTwo};