import { Link } from "react-router-dom";
import CommanBanner from "../../components/CommanBanner";
import IMAGES from "../../constant/theme";
import BlogSidebar from "../../elements/Blog/BlogSidebar";
import { Bloglight2 } from "../../constant/Alldata";
import CardBlog from "../../elements/Blog/CardBlog";
import SocialIcon from "../../elements/SocialIcon";

export default function BlogAuthor(){
    return(
        <div className="page-content bg-light">
            <CommanBanner mainText="Blog Author" parentText="Home" currentText="Blog Author" image={IMAGES.BackBg1} />
            <section className="content-inner-1 z-index-unset">
                <div className="container">
                    <div className="row">                        
                        <div className="col-xl-8 col-lg-8">
                            <div className="row justify-content-center">
                                <div className="col-lg-12 col-md-12 wow fadeInUp" data-wow-delay="0.1s">
                                    <div className="author-box m-b30 style-1">
                                        <div className="author-profile-info">
                                            <div className="author-profile-pic">
                                                <img src={IMAGES.BlogProfile} alt="/" />
                                            </div>
                                            <div className="author-profile-content">
                                                <h6 className="title">I am John Doe</h6>
                                                <p>I am a developer based in Melbourne</p>
                                                <img src={IMAGES.Signing} alt="/" />
                                                <ul className="social-icon m-b0">                                                    
                                                    <SocialIcon />
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {Bloglight2.map((item, ind)=>(
                                    <div className="col-lg-12 m-b30 wow fadeInUp" data-wow-delay={item.dealy} key={ind}>
                                        <div className="dz-card blog-half style-5">                                           
                                            <CardBlog image={item.image} date={item.date} text={item.text} />
                                        </div>
                                    </div>
                                ))}                                
                                <div className="col-12 text-center mt-sm-4 mt-2 wow fadeInUp" data-wow-delay="0.7s">
                                    <Link to="/blog-dark-half-image" className="btn btn-secondary">
                                        Load More
                                    </Link>
                                </div>
                            </div>
                        </div>			
                        <div className="col-xl-4 col-lg-4">
                            <aside className="side-bar right sticky-top m-b30">
                                <BlogSidebar />
                            </aside>
                        </div>	
                    </div>
                </div>
            </section>
        </div>
    )
}