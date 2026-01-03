import { Fragment } from "react/jsx-runtime";
import CommanBanner from "../../components/CommanBanner";
import IMAGES from "../../constant/theme";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FooterStyleCode2 } from "../../constant/Alldata";
import CopySectionText from "../../constant/CopySectionText";

export default function FooterStyle2(){
    return(
        <Fragment>
            <div className="page-wraper">
                <Header design="" />
                <div className="page-content bg-light">
                    <CommanBanner currentText="Footer Style 2" mainText="Footer Style 2" parentText="Home" image={IMAGES.BackBg1} />
                    <div className="content-inner">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="code-copy">
                                    <CopySectionText code={FooterStyleCode2} />
                                    <pre className="code-box" id="copyTarget">
{FooterStyleCode2}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer footerStyle="footer-dark" />
            </div>
        </Fragment>
    )
}