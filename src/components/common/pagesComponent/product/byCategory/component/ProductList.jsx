// src/app/pages/product/category/[id]/components/ProductList.jsx

import ProductListItem from "./ProductListItem";

 

export default function ProductList({ products }) {
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <ProductListItem key={product.id} product={product} />
      ))}
    </div>
  );
}