import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { CategoryData, TagData, widgetBox } from "../../constant/Alldata";
import PostTitleWithImage from "../../elements/Post/PostTitleWithImage";
import IMAGES from "../../constant/theme";
import AdditionalInfo from "../../elements/Post/AdditionalInfo";
import PostTag from "../../elements/Post/PostTag";
import SocialIcon from "../../elements/SocialIcon";
import AuthorProfile from "../../elements/Post/AuthorProfile";
import RelatedPost from "../../elements/Post/RelatedPost";
import Comments from "../../elements/Post/Comments";

export default function PostBothSidebar(){
    return(
        <div className="page-wraper">
            <Header design="border-bottom" />
            <div className="page-content bg-light">
                <section className="content-inner-1 z-index-unset">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-xl-3 col-lg-5 col-md-12 m-b30 order-lg-1 order-sm-2 order-2">
                                <aside className="side-bar left sticky-top mt-lg-0 mt-md-5">
                                    <div className="widget recent-posts-entry">
                                        <h5 className="widget-title">Latest Post</h5>
                                        <div className="widget-post-bx">
                                            {widgetBox.map((data, ind)=>(
                                                <div className="widget-post clearfix" key={ind}>
                                                    <div className="dz-media"> 
                                                        <Link to="/post-standard"><img src={data.image} alt="/" /></Link>
                                                    </div>
                                                    <div className="dz-info">
                                                        <div className="dz-meta">
                                                            <ul>
                                                                <li className="post-date"> {data.date} </li>
                                                            </ul>
                                                        </div>
                                                        <h6 className="title"><Link to="/post-standard">{data.title}</Link></h6>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="widget widget_categories style-1">
                                        <h5 className="widget-title">Category</h5>
                                        <ul>
                                            {CategoryData.map((elem, i)=>(
                                                <li className="cat-item" key={i}><Link to="/blog-category">{elem.name}</Link> ({elem.number})</li>
                                            ))} 
                                        </ul>
                                    </div>
                                    
                                </aside>
                            </div>
                            <div className="col-xl-6 col-lg-7 col-md-12 m-b30 order-lg-2 order-sm-1">
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div className="dz-blog blog-single style-1 no-sidebar">
                                            <PostTitleWithImage image={true}/>
                                            <div className="dz-info">
                                                <div className="dz-post-text">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                                    <blockquote className="wp-block-quote is-style-default"><p>Create An Information Architecture That’s Easy To Use Way Precise Usability Considerations For Partially </p><cite>Ronald M. Spino</cite><i className="flaticon-right-quote"></i></blockquote>
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                                    <figure className="wp-container-5 wp-block-gallery-3 wp-block-gallery has-nested-images columns-3 is-cropped">
                                                        <figure className="wp-block-image size-large"><img src={IMAGES.BlogPost3Pic1} alt="/" /></figure>
                                                        <figure className="wp-block-image size-large"><img src={IMAGES.BlogPost3Pic2} alt="/" /></figure>
                                                        <figure className="wp-block-image size-large"><img src={IMAGES.BlogPost3Pic3} alt="/" /></figure>
                                                        <figure className="wp-block-image size-large"><img src={IMAGES.BlogPost3Pic4} alt="/" /></figure>
                                                        <figure className="wp-block-image size-large"><img src={IMAGES.BlogPost3Pic1} alt="/" /></figure>
                                                    </figure>
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                                    <AdditionalInfo />
                                                </div>
                                                <div className="dz-share-post meta-bottom">
                                                    <PostTag />
                                                    <div className="dz-social-icon primary-light">
                                                        <ul>
                                                            <SocialIcon />
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>                                            
                                        <div className="author-box style-1">
                                            <AuthorProfile />
                                        </div>
                                        <div className="dz-related-post">
                                            <RelatedPost />
                                        </div>                                        
                                        <div className="clear" id="comment-list">
                                           <Comments />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-12 col-md-12 m-b30 order-lg-3 order-sm-2">
                                <aside className="side-bar sticky-top mt-lg-0 mt-md-5">
                                    <div className="widget">
                                        <h5 className="widget-title">Search</h5>
                                        <div className="search-bx">
                                            <form role="search" method="post">
                                                <div className="input-group">
                                                    <input name="text" className="form-control" placeholder="Search" type="text" />
                                                    <span className="input-group-btn">
                                                            <button className="btn">
                                                            <i className="icon feather icon-search"></i>
                                                        </button>
                                                    </span>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="widget widget_categories style-1">
                                        <h5 className="widget-title">Category</h5>
                                        <ul>
                                            {CategoryData.map((elem, i)=>(
                                                <li className="cat-item" key={i}><Link to="/blog-category">{elem.name}</Link> ({elem.number})</li>
                                            ))}                                             
                                        </ul>
                                    </div>
                                    
                                    <div className="widget widget_tag_cloud">
                                        <h5 className="widget-title">Tags</h5>
                                        <div className="tagcloud"> 
                                            {TagData.map((item, ind)=>(
                                                <Link to="/blog-tag" key={ind}>{item.tagname}</Link>
                                            ))} 
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    )
}