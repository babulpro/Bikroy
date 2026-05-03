// src/app/pages/product/category/[id]/components/ProductGrid.jsx

import ProductCard from "./ProductCard";

 

export default function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}