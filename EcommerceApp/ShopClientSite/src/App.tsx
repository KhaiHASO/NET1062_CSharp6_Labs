import { BrowserRouter } from 'react-router-dom'
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-autoplay.css";
import "lightgallery/css/lg-fullscreen.css";
import "lightgallery/css/lg-share.css";
import "lightgallery/css/lg-zoom.css";


import './assets/vendor/swiper/swiper-bundle.min.css'
import './assets/css/style.css'
import './assets/css/skin/skin-1.css'


//router
import Index from './router/Index'

function App() {      
  return (
    <>
      <BrowserRouter basename='/'>
        <Index />
      </BrowserRouter>
    </>
  )
}

export default App
