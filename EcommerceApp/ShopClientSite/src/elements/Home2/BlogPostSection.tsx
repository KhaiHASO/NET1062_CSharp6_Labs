import { Link } from "react-router-dom";
import { BlogPostData } from "../../constant/Alldata";

export default function BlogPostSection(){
    return(
        <div className="row blog-shap">
            {BlogPostData.map((elem, i)=>(
                <div className="col-lg-6 col-md-6 col-sm-12 m-b30 wow fadeInUp" data-wow-delay="0.1s" key={i}>
                    <div className={`dz-card blog-half style-6 ${elem.coloumStyle}`}>
                        <div className="dz-media">
                            <img src={elem.image} alt="/" />
                        </div>
                        <div className="dz-info">
                            <div className="dz-meta">
                                <ul>
                                    <li className="post-date">{elem.date}</li>
                                </ul>
                            </div>
                            <h4 className="dz-title">
                                <Link to="/blog-grid-both-sidebar">{elem.name}</Link>
                            </h4>
                            <Link to="/blog-grid-both-sidebar" className="btn btn-theme text-uppercase">Read more<i className="fa-solid fa-arrow-right"/></Link>
                        </div>
                    </div>
                </div> 
            ))}
        </div>	
    )
}