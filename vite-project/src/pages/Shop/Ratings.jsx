/* eslint-disable react/prop-types */


const Ratings = ({rating}) => {
    const stars=[]
    for (let i=0;i<=5;i++)
    {
        stars.push(
            <span key={i} className={`ri-star${i<=rating?'-fill':'-line'}`}></span>
        )
    }
  return (
    <>
    <div className="product__rating">
        {stars}
    </div>
    </>
  )
}

export default Ratings