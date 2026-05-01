import Link from "next/link";

export default function Cta(){
    return(
        <section className="py-16 text-white bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
            Ready to Sell Your Products?
          </h2>
          <p className="mb-8 text-lg opacity-90">
            List your products for free and reach millions of buyers
          </p>
          <Link
            href="/pages/product/item/addProduct"
            className="inline-block px-8 py-3 font-semibold text-blue-700 transition-colors bg-yellow-400 rounded-lg shadow-lg hover:bg-yellow-300"
          >
            Start Selling Now
          </Link>
        </div>
      </section>
    )
}