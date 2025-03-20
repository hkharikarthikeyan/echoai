"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Award, Minus, Plus, ShoppingCart, Star, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export default function ProductPage() {
  const params = useParams();
  const productId = Number.parseInt(params.id as string) || 1;

  const [quantity, setQuantity] = useState(1);

  // Mock product data (replace with dynamic data fetching if needed)
  const product = {
    id: productId,
    name: "Eco-Friendly Recycled Notebook",
    description:
      "Crafted from 100% post-consumer recycled paper, this premium eco-friendly notebook is designed for sustainable writing. It features 120 smooth, acid-free pages bound in a sturdy kraft cover, making it perfect for journaling, sketching, and note-taking.",
    points: 250,
    category: "Stationery",
    featured: true,
    inStock: true,
    stockQuantity: 15,
    rating: 4.7,
    reviews: 32,
    images: ["/images/download-1.jpeg"],
  };

  // Increase quantity with stock limit check
  const increaseQuantity = () => {
    if (quantity < product.stockQuantity) {
      setQuantity((prev) => prev + 1);
    } else {
      toast({ title: "Stock Limit Reached", description: "You've reached the maximum available stock for this product." });
    }
  };

  // Decrease quantity with minimum limit check
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Add to cart with stock validation
  const addToCart = () => {
    if (!product.inStock) {
      toast({ title: "Out of Stock", description: "This product is currently out of stock." });
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);

    if (existingItemIndex !== -1) {
      // Update quantity if item already exists in cart
      const updatedQuantity = existingCart[existingItemIndex].quantity + quantity;
      if (updatedQuantity > product.stockQuantity) {
        toast({
          title: "Stock Limit Exceeded",
          description: `You can only add ${product.stockQuantity - existingCart[existingItemIndex].quantity} more of this item.`,
        });
        return;
      }
      existingCart[existingItemIndex].quantity = updatedQuantity;
    } else {
      // Add new item to cart
      existingCart.push({
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.images[0] || "/placeholder.svg",
        points: product.points,
        quantity: quantity,
        stockQuantity: product.stockQuantity || 10,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    toast({ title: "Added to Cart", description: `${product.name} has been added to your cart.` });

    // Trigger a custom event to notify the cart page
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="container py-10">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/shop">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to shop</span>
          </Link>
        </Button>
        <div className="ml-2 text-sm text-muted-foreground">
          <Link href="/shop" className="hover:underline">Shop</Link> / {product.category}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          {product.images.map((img, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
              <Image src={img} alt={product.name} fill className="object-cover" />
            </div>
          ))}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center mt-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
              />
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          <div className="flex items-center mb-6">
            <div className="text-2xl font-bold text-green-600 flex items-center">
              <Award className="h-5 w-5 mr-1" /> {product.points} points
            </div>
            {product.inStock ? (
              <span className="ml-4 text-sm text-green-700">In Stock ({product.stockQuantity} left)</span>
            ) : (
              <span className="ml-4 text-sm text-red-700 flex items-center">
                <XCircle className="h-4 w-4 mr-1" /> Out of Stock
              </span>
            )}
          </div>

          <p className="text-muted-foreground mb-6">{product.description}</p>

          {/* Quantity Selector */}
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="mx-4">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={increaseQuantity}
              disabled={quantity >= product.stockQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Add to Cart and Buy Now Buttons */}
          <div className="flex gap-4">
            <Button
              className="bg-green-600 hover:bg-green-700 flex-1"
              onClick={addToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/shop/cart">Buy Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}