// app/products/[id]/edit/page.jsx
import ProductForm from '@/lib/productUpload/productForm';
import { notFound } from 'next/navigation';

async function getProduct(id) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
    cache: 'no-store'
  });
  const data = await response.json();
  return data.success ? data.data : null;
}

export default async function EditProductPage({ params }) {
  const product = await getProduct(params.id);
  
  if (!product) {
    notFound();
  }
  
  return (
    <div className="container mx-auto py-8">
      <ProductForm 
        productId={params.id} 
        initialData={product}
      />
    </div>
  );
}