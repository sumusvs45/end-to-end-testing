/* eslint-disable no-unused-vars */

import blogsData from '../../data/blogs.json'
const Blogs = () => {
 
  return (
    <>
    <section className='section__container blog__container'>
        <h2 className='section__header'>Latest From Blog</h2>
        <p className='section__subheader'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {
                blogsData.map((blog,index)=>
                (
                    <div className="blog__card cursor-pointer hover:scale:105" key={index}>
                     <img src={blog.imageUrl} alt="img"/>
                    <div className="blog__card__content">
                        <h6>{blog.subtitle}</h6>
                        <h4>{blog.title}</h4>
                        <p>{blog.date}</p>
                    </div> 
                    </div>
                ))
            }
        </div>

    </section>
    </>
  )
}

export default Blogs