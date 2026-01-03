import { Outlet, Route, Routes } from "react-router-dom";

//header and footer
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollTop from "../constant/ScrollTop";
import SubscribeModal from "../constant/SubscribeModal";

// Index/Home Pages
import Home from "../pages/Home";
import Home2 from "../pages/Home2";
import Home3 from "../pages/Home3";

//About
import AboutMe from "../pages/About/AboutMe";
import AboutUs from "../pages/About/AboutUs";

//Other
import PricingTable from "../pages/PricingTable";
import OurGiftVouchers from "../pages/OurGiftVouchers";
import WhatWeDo from "../pages/WhatWeDo";
import Faq1 from "../pages/Faq/Faq1";
import Faq2 from "../pages/Faq/Faq2";
import OurTeam from "../pages/OurTeam";
import ShopCompare from "../pages/Shop/ShopCompare";
import ComingSoon from "../pages/ComingSoon";

// Auth Pages
import LoginPage from "../pages/LoginPage";
import ForgetPassword from "../pages/ForgetPassword";
import Registration from "../pages/Registration";

//Baner Style
import BannerWithColor from "../pages/BannerStyle/BannerWithColor";
import BannerWithImage from "../pages/BannerStyle/BannerWithImage";
import BannerWithVideo from "../pages/BannerStyle/BannerWithVideo";
import BannerWithKanbern from "../pages/BannerStyle/BannerWithKanbern";
import BannerSmall from "../pages/BannerStyle/BannerSmall";
import BannerMedium from "../pages/BannerStyle/BannerMedium";
import BannerLarge from "../pages/BannerStyle/BannerLarge";

//Contact us 
import ContactUs1 from "../pages/Contact/ContactUs1";
import ContactUs2 from "../pages/Contact/ContactUs2";
import ContactUs3 from "../pages/Contact/ContactUs3";

// Error pages
import ErrorPage1 from "../pages/Error/ErrorPage1";
import ErrorPage2 from "../pages/Error/ErrorPage2";
import UnderConstruction from "../pages/UnderConstruction";

//My Account Pages
import DashboardPage from "../pages/Account/DashboardPage";
import AccountOrder from "../pages/Account/AccountOrder";
import AccountOrderDetails from "../pages/Account/AccountOrderDetails";
import AccountOrderConfirm from "../pages/Account/AccountOrderConfirm";
import AccountDownloads from "../pages/Account/AccountDownloads";
import AccountReturnRequest from "../pages/Account/AccountReturnRequest";
import AccountReturnRequestDetails from "../pages/Account/AccountReturnRequestDetails";
import AccountReturnRequestConfirm from "../pages/Account/AccountReturnRequestConfirm";
import AccountProfile from "../pages/Account/AccountProfile";
import AccountAddress from "../pages/Account/AccountAddress";
import AccountShippingMethods from "../pages/Account/AccountShippingMethods";
import AccountPaymentMethods from "../pages/Account/AccountPaymentMethods";
import AccountReview from "../pages/Account/AccountReview";
import AccountBillingAddress from "../pages/Account/AccountBillingAddress";
import AccountShippingAddress from "../pages/Account/AccountShippingAddress";
import AccountCancellationRequests from "../pages/Account/AccountCancellationRequests";

// Portfolio Pages
import PortfolioDetails1 from "../pages/PortfolioDetails/PortfolioDetails1";
import PortfolioDetails2 from "../pages/PortfolioDetails/PortfolioDetails2";
import PortfolioDetails3 from "../pages/PortfolioDetails/PortfolioDetails3";
import PortfolioDetails4 from "../pages/PortfolioDetails/PortfolioDetails4";
import PortfolioDetails5 from "../pages/PortfolioDetails/PortfolioDetails5";
import PortfolioTiles from "../pages/PortfolioDetails/PortfolioTiles";
import PortfolioThumbsSlider from "../pages/PortfolioDetails/PortfolioThumbsSlider";
import PortfolioFilmStrip from "../pages/PortfolioDetails/PortfolioFilmStrip";
import PortfolioSplitSlider from "../pages/PortfolioDetails/PortfolioSplitSlider";
import CarouselShowcase from "../pages/PortfolioDetails/CarouselShowcase";
import CollageStyleOne from "../pages/PortfolioDetails/CollageStyleOne";
import CollageStyleTwo from "../pages/PortfolioDetails/CollageStyleTwo";
import CobbleStyleTwo from "../pages/PortfolioDetails/CobbleStyleTwo";
import CobbleStyleOne from "../pages/PortfolioDetails/CobbleStyleOne";
import MasonryGrid from "../pages/PortfolioDetails/MasonryGrid";

// Blog Pages
import BlogDark2Coloumn from "../pages/Blog/BlogDark2Column";
import BlogDark2Sidebar from "../pages/Blog/BlogDark2Sidebar";
import BlogDark3Coloumn from "../pages/Blog/BlogDark3Coloumn";
import BlogDarkHalfImage from "../pages/Blog/BlogDarkHalfImage";
import BlogLight2Column from "../pages/Blog/BlogLight2Column";
import BlogLight2Sidebar from "../pages/Blog/BlogLight2Sidebar";
import BlogLightHalfImage from "../pages/Blog/BlogLightHalfImage";
import BlogExclusive from "../pages/Blog/BlogExclusive";
import BlogListNoSidebar from "../pages/Blog/BlogListNoSidebar";
import BlogListLeftSidebar from "../pages/Blog/BlogListLeftSidebar";
import BlogListRightSidebar from "../pages/Blog/BlogListRightSidebar";
import BlogListBothSidebar from "../pages/Blog/BlogListBothSidebar";
import BlogGridNoSidebar from "../pages/Blog/BlogGridNoSidebar";
import BlogGridLeftSidebar from "../pages/Blog/BlogGridLeftSidebar";
import BlogGridRightSidebar from "../pages/Blog/BlogGridRightSidebar";
import BlogGridBothSidebar from "../pages/Blog/BlogGridBothSidebar";
import BlogArchive from "../pages/Blog/BlogArchive";
import BlogAuthor from "../pages/Blog/BlogAuthor";
import BlogCategory from "../pages/Blog/BlogCategory";
import BlogTag from "../pages/Blog/BlogTag";
import PostStandard from "../pages/Post/PostStandard";
import BlogGridWideSidebar from "../pages/Blog/BlogGridWideSidebar";

// Post Pages
import PostText from "../pages/Post/PostText";
import PostImage from "../pages/Post/PostImage";
import PostVideo from "../pages/Post/PostVideo";
import PostLink from "../pages/Post/PostLink";
import PostAudio from "../pages/Post/PostAudio";
import PostQuote from "../pages/Post/PostQuote";
import PostTutorial from "../pages/Post/PostTutorial";
import PostCateloge from "../pages/Post/PostCateloge";
import PostBanner from "../pages/Post/PostBanner";
import PostSlideShow from "../pages/Post/PostSlideShow";
import PostGallery from "../pages/Post/PostGallery";
import PostStatus from "../pages/Post/PostStatus";
import PostCorner from "../pages/Post/PostCorner";
import PostSide from "../pages/Post/PostSide";
import PostLeftSidebar from "../pages/Post/PostLeftSidebar";
import PostRightSidebar from "../pages/Post/PostRightSidebar";
import PostBothSidebar from "../pages/Post/PostBothSidebar";
import PostNoSidebar from "../pages/Post/PostNoSidebar";

// Shop Pages
import ShopStyle2 from "../pages/Shop/ShopStyle2";
import ShopStyle1 from "../pages/Shop/ShopStyle1";
import ShopStandard from "../pages/Shop/ShopStandard";
import ShopList from "../pages/Shop/ShopList";
import ShopWithCategory from "../pages/Shop/ShopWithCategory";
import ShopFiltersTop from "../pages/Shop/ShopFiltersTop";
import ShopSidebarPage from "../pages/Shop/ShopSidebarPage";
import ShopProductDefault from "../pages/Shop/ShopProductDefault";
import ShopProductThumbnail from "../pages/Shop/ShopProductThumbnail";
import ShopProductGridMedia from "../pages/Shop/ShopProductGridMedia";
import ShopProductCarousel from "../pages/Shop/ShopProductCarousel";
import ShopProductFullWidth from "../pages/Shop/ShopProductFullWidth";
import ShopWishlist from "../pages/Shop/ShopWishlist";
import ShopCart from "../pages/Shop/ShopCart";
import ShopCheckout from "../pages/Shop/ShopCheckout";
import ShopOrderTracking from "../pages/Shop/ShopOrderTracking";

// Header Style
import HeaderStyleOne from "../pages/HeaderStyle/HeaderStyleOne";
import HeaderStyleTwo from "../pages/HeaderStyle/HeaderStyleTwo";
import HeaderStyleThree from "../pages/HeaderStyle/HeaderStyleThree";
import HeaderStyleFour from "../pages/HeaderStyle/HeaderStyleFour";
import HeaderStyleFive from "../pages/HeaderStyle/HeaderStyleFive";
import HeaderStyleSix from "../pages/HeaderStyle/HeaderStyleSix";
import HeaderStyleSeven from "../pages/HeaderStyle/HeaderStyleSeven";

// Footer Style
import FooterStyle1 from "../pages/FooterStyle/FooterStyle1";
import FooterStyle2 from "../pages/FooterStyle/FooterStyle2";
import FooterStyle3 from "../pages/FooterStyle/FooterStyle3";
import FooterStyle4 from "../pages/FooterStyle/FooterStyle4";
import FooterStyle5 from "../pages/FooterStyle/FooterStyle5";
import FooterStyle6 from "../pages/FooterStyle/FooterStyle6";
import FooterStyle7 from "../pages/FooterStyle/FooterStyle7";



const Index = () => {        
    function MainLayout(){
        return(
            <div className="page-wraper">
                <Header design="style-1 header-transparent"/>
                <Outlet />    
                <Footer />                
            </div>
        )
    }
    function CommanLayout2(){
        return(
            <div className="page-wraper">
                <Header design=""/>
                <Outlet />    
                <Footer />                
            </div>
        )
    }
    function WithoutFooterLayout(){
        return(
            <div className="page-wraper">
                <Header design=""/>
                <Outlet />                                
            </div>
        )
    }
    function Layout3Out(){
        return(
            <div className="page-wraper">
                <Header design="style-1 header-transparent"/>
                <Outlet />                               
            </div>
        )
    }

    return (
        <>
            <Routes>
                <Route path="/index-2" element={<Home2 />}/>
                <Route path="/error-2" element={<ErrorPage2 />}/>
                <Route path="/coming-soon" element={<ComingSoon />}/>
                <Route path="/under-construction" element={<UnderConstruction />}/>
                <Route path="/banner-with-video" element={<BannerWithVideo />} />
                <Route path="/banner-with-kanbern" element={<BannerWithKanbern />} />
                <Route path="/banner-small" element={<BannerSmall />} />
                <Route path="/banner-medium" element={<BannerMedium />} />
                <Route path="/banner-large" element={<BannerLarge />} />
                <Route path="/footer-style-2" element={<FooterStyle2 />} />
                <Route path="/footer-style-3" element={<FooterStyle3 />} />
                <Route path="/footer-style-4" element={<FooterStyle4 />} />
                <Route path="/footer-style-5" element={<FooterStyle5 />} />
                <Route path="/footer-style-6" element={<FooterStyle6 />} />
                <Route path="/footer-style-7" element={<FooterStyle7 />} />
                <Route path="/post-banner" element={<PostBanner />} />
                <Route path="/post-left-sidebar" element={<PostLeftSidebar />} />
                <Route path="/post-right-sidebar" element={<PostRightSidebar />} />
                <Route path="/post-both-sidebar" element={<PostBothSidebar />} />
                <Route path="/post-no-sidebar" element={<PostNoSidebar />} />
                <Route path="/shop-compare" element={<ShopCompare />} />
                <Route path="/header-style-2" element={<HeaderStyleTwo />} />
                <Route path="/header-style-3" element={<HeaderStyleThree />} />
                <Route path="/header-style-4" element={<HeaderStyleFour />} />
                <Route path="/header-style-6" element={<HeaderStyleSix />} />
                <Route path="/header-style-7" element={<HeaderStyleSeven />} />

                <Route element={<MainLayout/>}>
                    <Route path="/" element={<Home />}/>
                    <Route path="/faqs-2" element={<Faq2 />} />                    
                    <Route path="/index-3" element={<Home3 />} />       
                    <Route path="/shop-order-tracking" element={<ShopOrderTracking />} />  
                    <Route path="/login" element={<LoginPage />} />  
                    <Route path="/registration" element={<Registration />} />  
                    <Route path="/forget-password" element={<ForgetPassword />} />  
                </Route>            
                <Route element={<CommanLayout2/>}>
                    <Route path="/about-me" element={<AboutMe />}/>
                    <Route path="/about-us" element={<AboutUs />}/>
                    <Route path="/pricing-table" element={<PricingTable />}/>
                    <Route path="/our-gift-vouchers" element={<OurGiftVouchers />}/>
                    <Route path="/what-we-do" element={<WhatWeDo />} />
                    <Route path="/faqs-1" element={<Faq1 />} />
                    <Route path="/our-team" element={<OurTeam />} />
                    <Route path="/contact-us-3" element={<ContactUs3 />} />
                    <Route path="/error-1" element={<ErrorPage1 />} />
                    <Route path="/banner-with-bg-color" element={<BannerWithColor />} />
                    <Route path="/banner-with-image" element={<BannerWithImage />} />
                    <Route path="/account-dashboard" element={<DashboardPage />} />
                    <Route path="/account-orders" element={<AccountOrder />} />
                    <Route path="/account-order-details" element={<AccountOrderDetails />} />
                    <Route path="/account-order-confirmation" element={<AccountOrderConfirm />} />
                    <Route path="/account-downloads" element={<AccountDownloads />} />
                    <Route path="/account-return-request" element={<AccountReturnRequest />} />
                    <Route path="/account-return-request-detail" element={<AccountReturnRequestDetails />} />
                    <Route path="/account-refund-requests-confirmed" element={<AccountReturnRequestConfirm />} />
                    <Route path="/account-profile" element={<AccountProfile />} />
                    <Route path="/account-address" element={<AccountAddress />} />
                    <Route path="/account-shipping-methods" element={<AccountShippingMethods />} />                    
                    <Route path="/account-payment-methods" element={<AccountPaymentMethods />} />                    
                    <Route path="/account-review" element={<AccountReview />} />            
                    <Route path="/account-billing-address" element={<AccountBillingAddress />} />            
                    <Route path="/account-shipping-address" element={<AccountShippingAddress />} />            
                    <Route path="/account-cancellation-requests" element={<AccountCancellationRequests />} />                                                            
                    <Route path="/footer-style-1" element={<FooterStyle1 />} />
                    {/* Portfolio Pages */}
                    <Route path="/portfolio-details-1" element={<PortfolioDetails1 />} />
                    <Route path="/portfolio-details-2" element={<PortfolioDetails2 />} />
                    <Route path="/portfolio-details-3" element={<PortfolioDetails3 />} />
                    <Route path="/portfolio-details-4" element={<PortfolioDetails4 />} />
                    <Route path="/portfolio-details-5" element={<PortfolioDetails5 />} />
                    <Route path="/portfolio-tiles" element={<PortfolioTiles />} />
                    <Route path="/collage-style-1" element={<CollageStyleOne />} />
                    <Route path="/collage-style-2" element={<CollageStyleTwo />} />
                    <Route path="/masonry-grid" element={<MasonryGrid />} />
                    <Route path="/cobble-style-1" element={<CobbleStyleOne />} />
                    <Route path="/cobble-style-2" element={<CobbleStyleTwo />} />
                    {/* Blog Pages */}
                    <Route path="/blog-dark-2-column" element={<BlogDark2Coloumn />} />
                    <Route path="/blog-dark-2-column-sidebar" element={<BlogDark2Sidebar />} />
                    <Route path="/blog-dark-3-column" element={<BlogDark3Coloumn />} />
                    <Route path="/blog-dark-half-image" element={<BlogDarkHalfImage />} />
                    <Route path="/blog-light-2-column" element={<BlogLight2Column />} />
                    <Route path="/blog-light-2-column-sidebar" element={<BlogLight2Sidebar />} />
                    <Route path="/blog-light-half-image" element={<BlogLightHalfImage />} />
                    <Route path="/blog-exclusive" element={<BlogExclusive />} />
                    <Route path="/blog-list-no-sidebar" element={<BlogListNoSidebar />} />
                    <Route path="/blog-list-left-sidebar" element={<BlogListLeftSidebar />} />
                    <Route path="/blog-list-right-sidebar" element={<BlogListRightSidebar />} />
                    <Route path="/blog-list-both-sidebar" element={<BlogListBothSidebar />} />
                    <Route path="/blog-grid-no-sidebar" element={<BlogGridNoSidebar />} />
                    <Route path="/blog-grid-left-sidebar" element={<BlogGridLeftSidebar />} />
                    <Route path="/blog-grid-right-sidebar" element={<BlogGridRightSidebar />} />
                    <Route path="/blog-grid-both-sidebar" element={<BlogGridBothSidebar />} />
                    <Route path="/blog-grid-wide-sidebar" element={<BlogGridWideSidebar />} />
                    <Route path="/blog-archive" element={<BlogArchive />} />
                    <Route path="/blog-author" element={<BlogAuthor />} />
                    <Route path="/blog-category" element={<BlogCategory />} />
                    <Route path="/blog-tag" element={<BlogTag />} />
                    <Route path="/post-standard" element={<PostStandard />} />
                    <Route path="/post-text" element={<PostText />} />
                    <Route path="/post-image" element={<PostImage />} />
                    <Route path="/post-video" element={<PostVideo />} />
                    <Route path="/post-link" element={<PostLink />} />
                    <Route path="/post-audio" element={<PostAudio />} />
                    <Route path="/post-quote" element={<PostQuote />} />
                    <Route path="/post-tutorial" element={<PostTutorial />} />
                    <Route path="/post-cateloge" element={<PostCateloge />} />                    
                    <Route path="/post-slide-show" element={<PostSlideShow />} />                    
                    <Route path="/post-gallery" element={<PostGallery />} />                    
                    <Route path="/post-status" element={<PostStatus />} />                    
                    <Route path="/post-corner" element={<PostCorner />} />                    
                    <Route path="/post-side" element={<PostSide />} />                    
                    {/* Shop Standard */}
                    <Route path="/shop-standard" element={<ShopStandard />} />                    
                    <Route path="/shop-list" element={<ShopList />} />                    
                    <Route path="/shop-style-1" element={<ShopStyle1 />} />                                        
                    <Route path="/shop-style-2" element={<ShopStyle2 />} />    
                    <Route path="/shop-with-category" element={<ShopWithCategory />} />    
                    <Route path="/shop-filters-top-bar" element={<ShopFiltersTop />} />    
                    <Route path="/shop-sidebar" element={<ShopSidebarPage />} />    
                    <Route path="/product-default" element={<ShopProductDefault />} />    
                    <Route path="/product-thumbnail" element={<ShopProductThumbnail />} />    
                    <Route path="/product-grid-media" element={<ShopProductGridMedia />} />    
                    <Route path="/product-carousel" element={<ShopProductCarousel />} />    
                    <Route path="/product-full-width" element={<ShopProductFullWidth />} />    
                    <Route path="/shop-wishlist" element={<ShopWishlist />} />    
                    <Route path="/shop-cart" element={<ShopCart />} />    
                    <Route path="/shop-checkout" element={<ShopCheckout />} />    
                    <Route path="/header-style-1" element={<HeaderStyleOne />} />
                    <Route path="/header-style-5" element={<HeaderStyleFive />} />
                      
                    
                </Route>
                <Route element={<WithoutFooterLayout />}>
                    <Route path="/contact-us-1" element={<ContactUs1 />} />
                    <Route path="/portfolio-thumbs-slider" element={<PortfolioThumbsSlider />} />
                    <Route path="/carousel-showcase" element={<CarouselShowcase />} />
                    <Route path="/portfolio-film-strip" element={<PortfolioFilmStrip />} />
                    <Route path="/portfolio-split-slider" element={<PortfolioSplitSlider />} />
                </Route>
                <Route element={<Layout3Out />}>
                    <Route path="/contact-us-2" element={<ContactUs2 />} />
                </Route>
                
            </Routes>
            <ScrollTop /> 
            <SubscribeModal />
              
        </>
    );
};

export default Index;