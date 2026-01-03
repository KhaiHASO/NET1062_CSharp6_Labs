import { Fragment } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { CategoryData, colorData, TagData, widgetSize } from "../../constant/Alldata";
import ShopSidebarPriceSlider from "./ShopSidebarPriceSlider";

export default function ShopSidebar(){
    return(
        <Fragment>           
            <div className="widget widget_search">
                <div className="form-group">
                    <div className="input-group">
                        <input name="dzSearch" required type="search" className="form-control" placeholder="Search Product" />
                        <div className="input-group-addon">
                            <button name="submit" value="Submit" type="submit" className="btn">
                                <i className="icon feather icon-search"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="widget">
                <h6 className="widget-title">Price</h6>
                <div className="price-slide range-slider">
                    <div className="price">
                        <ShopSidebarPriceSlider />
                    </div>
                </div>
            </div>
            <div className="widget">
                <h6 className="widget-title">Color</h6>
                <div className="d-flex align-items-center flex-wrap color-filter ps-2">
                    {colorData.map((item, ind)=>(
                        <div className="form-check" key={ind}>
                            <input className="form-check-input" type="radio" name="radioNoLabel" id={item.inputid} value={item.valuecolor}  defaultChecked/>
                            <span style={{backgroundColor : item.valuecolor}}></span>
                        </div>
                    ))}                    
                </div>
            </div>
            
            <div className="widget">
                <h6 className="widget-title">Size</h6>
                <div className="btn-group product-size">
                    {widgetSize.map((item, ind)=>(
                        <Fragment key={ind}>
                            <input type="radio" className="btn-check" name="btnradio1" id={item.inputid} defaultChecked  />
                            <label className="btn" htmlFor={item.inputid}>{item.number}</label>
                        </Fragment>
                    ))}                    
                </div>
            </div>
            
            <div className="widget widget_categories">
                <h6 className="widget-title">Category</h6>
                <ul>
                    {CategoryData.map((elem, i)=>(
                        <li className="cat-item cat-item-26" key={i}><Link to="/blog-category">{elem.name}</Link> ({elem.number})</li>
                    ))}                    
                </ul>
            </div>
            
            <div className="widget widget_tag_cloud">
                <h6 className="widget-title">Tags</h6>
                <div className="tagcloud"> 
                    {TagData.map((item, ind)=>(
                        <Link to="/blog-tag" key={ind}>{item.tagname}</Link>
                    ))}                                                
                </div>
            </div>            
        </Fragment>
    )
}