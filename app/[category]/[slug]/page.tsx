import { notFound } from "next/navigation"
import ProductPage from "@/components/product/ProductPage"

export default async function ProductDetails({ params }: { params: { slug: string } }) {
  const res = await fetch(`http://localhost:3000/api/listings/product/${params.slug}`, {
    cache: "no-store", // always get latest
  })
  if (!res.ok) return notFound()
  const product = await res.json()
  return <ProductPage product={product.data} />
}
