import instaImg1 from "../../src/assets/instagram-1.jpg";
import instaImg2 from "../../src/assets/instagram-2.jpg";
import instaImg3 from "../../src/assets/instagram-3.jpg";
import instaImg4 from "../../src/assets/instagram-4.jpg";

const Footer = () => {
  return (
    <>
      <footer className="section__container footer__container">
        <div className="footer__col">
          <h4>Contact Info</h4>
          <p>
            <span>
              <i className="ri-map-pin-2-fill"></i>
            </span>
          </p>
          123 India Andhrapradesh
          <p>
            <span>
              <i className="ri-mail-line"></i>
            </span>
            Support@Zing.com
          </p>
          <p>
            <span>
              <i className="ri-phone-fill"></i>
            </span>
            91-12000004580
          </p>
        </div>
        <div className="footer__col">
          <h4>Company</h4>
          <a href="#">Home</a>
          <a href="#">About us</a>
          <a href="#">Work With Us</a>
          <a href="#">Our Blogs</a>
        </div>
        <div className="footer__col">
          <h4>UseFUL links</h4>
          <a href="#">Help</a>
          <a href="#">Track your Order</a>
          <a href="#">Men</a>
          <a href="#">Womem</a>
        </div>
        <div className="footer__col">
          <div className="instagram__grid">
            <img src={instaImg1} alt="img" />
            <img src={instaImg2} alt="img" />
            <img src={instaImg3} alt="img" />
            <img src={instaImg4} alt="img" />
          </div>
        </div>
        <div className="footer__bar text-center">
          Copyright @ 2025 by zing.All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Footer;
