import { Link } from 'react-router-dom';
import category1 from "../../src/assets/category-1.jpg";
import category2 from "../../src/assets/category-2.jpg";
import category3 from "../../src/assets/category-3.jpg";
import category4 from "../../src/assets/category-4.jpg";

const Categories = () => {
    const categories = [
        { name: "Accesories", path: "accessories", image: category1 },
        { name: "DressCollection", path: "dress", image: category2 },
        { name: "Jewellery", path: "jewellery", image: category3 },
        { name: "cosmetics", path: "cosmetics", image: category4 },
    ];

    return (
        <div className="product__grid">
            {
                categories.map((category) => {
                    return (
                        <Link key={category.name} to={`/categories/${category.path}`} className='categories__card'>
                            <img src={category.image} alt={category.name} />
                            <h4>{category.name}</h4>
                        </Link>
                    );
                })
            }
        </div>
    );
}

export default Categories;
