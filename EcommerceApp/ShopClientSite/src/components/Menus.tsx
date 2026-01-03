import { Link } from "react-router-dom";
import IMAGES from "../constant/theme";
import CountdownBlog from "./CountdownBlog";
import { Fragment, useReducer } from "react";
import { accountMenuItem, menuData2, menuData3, menuData4, menuDataOne, portfolioMenu } from "../constant/Alldata";

interface reduType{
    type : string;        
    index : number;
}

interface stateType {
    home: boolean;
    openMenu: number | null; 
}

const initialState = {
    home: false,
    openMenu: null,
};

const reducer = (state: stateType, action: reduType) => {
    switch (action.type) {
        case 'home':
            return { ...state, home: !state.home };
        case 'toggleMenu':            
            return {
                ...state,
                openMenu: state.openMenu === action.index ? null : action.index,
            };
        default:
            return state;
    }
};
export default function Menus(){    
    const [state, dispatch] = useReducer(reducer, initialState);
       
    return(
        <ul className="nav navbar-nav">
            <li className={`has-mega-menu sub-menu-down auto-width menu-left ${state.openMenu === 0 ? 'open' : ''}`}                
                onClick={() => dispatch({ type: 'toggleMenu', index: 0 })}
            >
                <Link to="#"><span>Home</span><i className="fas fa-chevron-down tabindex" /></Link>
                <div className="mega-menu ">
                    <ul className="demo-menu mb-0">
                        <li>
                            <Link to="/">
                                <img src={IMAGES.demo1} alt="/" />
                                <span className="menu-title">01 Home Page</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/index-2">
                                <img src={IMAGES.demo2} alt="/" />
                                <span className="menu-title">02 Home Page</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/index-3">
                                <img src={IMAGES.demo3} alt="/" />
                                <span className="menu-title">03 Home Page</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </li>
            <li className={`has-mega-menu sub-menu-down ${state.openMenu === 1 ? 'open' : ''}`}                
                onClick={() => dispatch({ type: 'toggleMenu', index: 1 })}
            >
                <Link to="#"><span>Shop</span><i className="fas fa-chevron-down tabindex" /></Link>                      
                <div className="mega-menu shop-menu">
                    <ul>
                        <li className="side-left">
                            <ul>
                                {menuDataOne.map((menu, index) => (
                                    <li key={index}>
                                        <Link to="#" className="menu-title">{menu.title}</Link>
                                        <ul>
                                            {menu.links.map((link, linkIndex) => (
                                                <li key={linkIndex}>
                                                    <Link to={link.path}>{link.name}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}                                
                                <li className="month-deal">
                                    <div className="clearfix me-3">
                                        <h3>Deal of the month</h3>
                                        <p className="mb-0">Yes! Send me exclusive offers, personalised, and unique gift ideas, tips for shopping on Pixio <Link to="/shop-standard" className="dz-link-2">View All Products</Link></p>
                                    </div>
                                    <div className="sale-countdown">
                                        <CountdownBlog />
                                    </div>
                                </li>
                            </ul>
                        </li>
                        <li className="side-right">
                            <div className="adv-media">
                                <img src={IMAGES.Adv1} alt="/" />
                            </div>
                        </li>
                    </ul>
                </div>     
            </li>
            <li className={`has-mega-menu sub-menu-down auto-width ${state.openMenu === 2 ? "open" : ""}`}
                onClick={() => dispatch({ type: 'toggleMenu', index: 2 })}
            >
                <Link to="#"><span>Blog</span><i className="fas fa-chevron-down tabindex"/></Link>
                <div className="mega-menu">
                    <ul>                       
                        {menuData2.map((item, index) => (
                            <li key={index}>
                                {
                                    item.mainmenu && item.mainmenu.map((item, ind)=>(
                                        <Fragment key={ind}>
                                            <Link to="#" className="menu-title">{item.title}</Link>
                                            <ul>
                                                {item.subMenu && item.subMenu.map((elem, ind)=>(
                                                    <li key={ind}><Link to={elem.link}>{elem.title}</Link></li>
                                                ))}                                                    
                                            </ul>
                                        </Fragment>
                                    ))    
                                }                                
                            </li>
                        ))}                      
                        <li className="post-menu">
                            <Link to="#" className="menu-title">Recent Posts</Link>
                            <div className="widget widget_post pt-2">
                                <ul>
                                    <li>
                                        <div className="dz-media">
                                            <img src={IMAGES.ProductSmall1} alt="small" />
                                        </div>
                                        <div className="dz-content">
                                            <h6 className="name"><Link to="/post-standard">Cozy Knit Cardigan Sweater</Link></h6>
                                            <span className="time">July 23, 2024</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="dz-media">
                                            <img src={IMAGES.ProductSmall2} alt="small" />
                                        </div>
                                        <div className="dz-content">
                                            <h6 className="name"><Link to="/post-standard">Sophisticated Swagger Suit</Link></h6>
                                            <span className="time">July 23, 2024</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="dz-media">
                                            <img src={IMAGES.ProductSmall3} alt="small" />
                                        </div>
                                        <div className="dz-content">
                                            <h6 className="name"><Link to="/post-standard">Athletic Mesh Sports Leggings</Link></h6>
                                            <span className="time">July 23, 2024</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="dz-media">
                                            <img src={IMAGES.ProductSmall4} alt="small" />
                                        </div>
                                        <div className="dz-content">
                                            <h6 className="name"><Link to="/post-standard">Satin Wrap Party Blouse</Link></h6>
                                            <span className="time">July 23, 2024</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </li>
            <li className={`has-mega-menu sub-menu-down auto-width ${state.openMenu === 3 ? "open" : ""}`}
                onClick={() => dispatch({ type: 'toggleMenu', index: 3 })}
            >
                <Link to="#"><span>Post Layout</span><i className="fas fa-chevron-down tabindex"/></Link>
                <div className="mega-menu">
                    <ul>
                        {menuData3.map((item, index) => (
                            <li key={index}>
                                {
                                    item.mainmenu && item.mainmenu.map((item, ind)=>(
                                        <Fragment key={ind}>
                                            <Link to="#" className="menu-title">{item.title}</Link>
                                            <ul>
                                                {item.subMenu && item.subMenu.map((elem, ind)=>(
                                                    <li key={ind}><Link to={elem.link}>{elem.title}</Link></li>
                                                ))}                                                    
                                            </ul>
                                        </Fragment>
                                    ))    
                                } 
                            </li>
                        ))}    
                    </ul>                   
                </div>
            </li>
            <li className={`has-mega-menu sub-menu-down ${state.openMenu === 4 ? "open" : ""}`}
                onClick={() => dispatch({ type: 'toggleMenu', index: 4 })}
            >
                <Link to="#"><span>Portfolio</span><i className="fas fa-chevron-down tabindex"/></Link>
                <div className="mega-menu portfolio-menu">
                    <ul>
                        <li className="side-left">
                            <ul className="portfolio-nav-link">
                                {portfolioMenu.map((elem , ind)=>(
                                    <li key={ind}>
                                        <Link to={elem.url}>
                                            <img src={elem.image} alt="/" />
                                            <span>{elem.title}</span>
                                        </Link>
                                    </li>
                                ))}                                
                            </ul>
                        </li>
                        <li className="side-right line-left">
                            <Link to="#" className="menu-title">Portfolio Details</Link>
                            <ul>
                                <li><Link to="/portfolio-details-1">Portfolio Details 1</Link></li>
                                <li><Link to="/portfolio-details-2">Portfolio Details 2</Link></li>
                                <li><Link to="/portfolio-details-3">Portfolio Details 3</Link></li>
                                <li><Link to="/portfolio-details-4">Portfolio Details 4</Link></li>
                                <li><Link to="/portfolio-details-5">Portfolio Details 5</Link></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </li>
            <li className={`has-mega-menu sub-menu-down wide-width ${state.openMenu === 5 ? "open" : ""}`}
               onClick={() => dispatch({ type: 'toggleMenu', index: 5 })}
            >
                <Link to="#" >
                    <span>Pages</span>
                    <i className="fas fa-chevron-down tabindex"/>
                </Link>
                <div className="mega-menu">
                    <ul>             
                        {menuData4.map((data, ind)=>(
                            <li key={ind}>
                                {data.mainMenu && data.mainMenu.map((item, index)=>(
                                    <Fragment key={index}>
                                        <Link to={item.link} className="menu-title">{item.title}</Link>                                        
                                        <ul>
                                            {item.subMenu && item.subMenu.map((elem, i)=>(                                                
                                                <Fragment  key={i}>
                                                    <li><Link to={`${elem.path}`}>{elem.name}</Link></li>
                                                    {elem.outerlink &&
                                                        <li className="w3menulink"><Link to="https://xmenu.indiankoder.com/react/" target="_blank">Menu Styles</Link></li>
                                                    }
                                                </Fragment>
                                            ))}
                                        </ul>
                                    </Fragment>
                                ))}
                            </li>
                        ))}          
                    </ul>
                </div>
            </li>
            <li className={`sub-menu-down ${state.openMenu === 6 ? "open" : ""}`}
                onClick={() => dispatch({ type: 'toggleMenu', index: 6 })}
            >
                <Link to="#"><span>My Account</span> <i className="fas fa-chevron-down tabindex"/></Link>
                <ul className="sub-menu">						
                    {accountMenuItem.map((data,index)=>(
                        <li key={index}><Link to={data.url}>{data.name}</Link></li>
                    ))}                    
                </ul>
            </li>
        </ul>
    )
}