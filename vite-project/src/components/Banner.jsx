/* eslint-disable react/no-unescaped-entities */
import { Link } from "react-router-dom"
import bannerImg from "../../src/assets/banner.png"

const Banner = () => {
  return (
    <>
    <div className="section__container header__container">
        <div className="header__content z-30">
            <h4>Up to 20% Discount on</h4>
            <h1>Girls' Fashion</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias earum suscipit vel iusto accusantium, vero rem, aliquid tempore mollitia inventore vitae? Odio culpa eaque architecto accusamus eius id tempore deleniti!
            Amet  </p>
            <button className="btrn"><Link to="/shop">Explore Now</Link></button>
        </div>
        <div className="header__image">
            <img src={bannerImg} alt="image"/>
        </div>
        
    </div>
    </>
  )
}

export default Banner