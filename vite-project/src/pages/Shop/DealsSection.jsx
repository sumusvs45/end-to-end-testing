

import dealsImg from '../../assets/deals.png'
const DealsSection = () => {
  return (
    <>
       <section className="section__container deals__container">
        <div className="deals__image">
            <img src={dealsImg} alt="image"/>
        </div>
        <div className="deals__content">
            <h5>Get Up To 20% Discount</h5>
            <h4>Deals of This Month</h4>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet, dolorum quae dicta consequuntur, deleniti non, minus quidem animi quod minima nemo obcaecati.</p>
            <div className="deals__countdown flex-wrap">
                
                <div className="deals__countdown__card">
                <h4>14</h4>
                <p>Days</p>
                 
                </div>
                <div className="deals__countdown__card">
                <h4>24</h4>
                <p>Hours</p>
                 
                </div>

            </div>

        </div>

       </section>
    </>
  )
}

export default DealsSection