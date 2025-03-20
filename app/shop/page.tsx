"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Award, Filter, Search, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Chatbot from "@/components/ChatBot"

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("featured")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<string[]>([])

  // Mock products data
  const products = [
    {
      id: 1,
      name: "Recycled Notebook",
      description: "Made from 100% recycled paper",
      points: 200,
      category: "Stationery",
      featured: true,
      image: "/images/download-1.jpeg",
    },
    {
      id: 2,
      name: "Bamboo Cutlery Set",
      description: "Sustainable alternative to plastic utensils",
      points: 350,
      category: "Kitchen",
      featured: true,
      image: "/images/download-2.jpeg",
    },
    {
      id: 3,
      name: "Solar Power Bank",
      description: "Charge your devices with solar energy",
      points: 1200,
      category: "Electronics",
      featured: false,
      image: "/images/download-3.jpeg",
    },
    {
      id: 4,
      name: "Eco-Friendly Water Bottle",
      description: "Reusable stainless steel bottle",
      points: 500,
      category: "Kitchen",
      featured: true,
      image: "/images/download-3.jpeg",
    },
    {
      id: 5,
      name: "Recycled Tote Bag",
      description: "Made from recycled plastic bottles",
      points: 300,
      category: "Accessories",
      featured: false,
      image: "/images/download-4.jpeg",
    },
    {
      id: 6,
      name: "LED Desk Lamp",
      description: "Energy-efficient lighting solution",
      points: 800,
      category: "Home",
      featured: false,
      image: "/images/download.jpeg",
    },
    {
      id: 7,
      name: "Bamboo Toothbrush",
      description: "Biodegradable alternative to plastic",
      points: 150,
      category: "Personal Care",
      featured: false,
      image: "/images/download-6.jpeg",
    },
    {
      id: 8,
      name: "Recycled Plastic Plant Pot",
      description: "Made from recycled ocean plastic",
      points: 400,
      category: "Home",
      featured: false,
      image: "/images/download-5.jpeg",
    },
    
  ]

  // Get unique categories
  const categories = [...new Set(products.map((product) => product.category))]

  // Price ranges
  const priceRanges = [
    { label: "Under 300 points", value: "under300" },
    { label: "300-500 points", value: "300to500" },
    { label: "500-1000 points", value: "500to1000" },
    { label: "Over 1000 points", value: "over1000" },
  ]

  // Filter products based on search, categories, and price range
  const filteredProducts = products.filter((product) => {
    // Search filter
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Category filter
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)

    // Price range filter
    const matchesPriceRange =
      priceRange.length === 0 ||
      (priceRange.includes("under300") && product.points < 300) ||
      (priceRange.includes("300to500") && product.points >= 300 && product.points <= 500) ||
      (priceRange.includes("500to1000") && product.points > 500 && product.points <= 1000) ||
      (priceRange.includes("over1000") && product.points > 1000)

    return matchesSearch && matchesCategory && matchesPriceRange
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "featured":
        return b.featured ? 1 : -1
      case "low":
        return a.points - b.points
      case "high":
        return b.points - a.points
      default:
        return 0
    }
  })

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  // Toggle price range selection
  const togglePriceRange = (range: string) => {
    setPriceRange((prev) => (prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]))
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
    setPriceRange([])
    setSortOption("featured")
  }

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Eco-Friendly Shop</h1>
        <p className="mt-4 text-muted-foreground md:text-xl">
          Redeem your reward points for sustainable products that make a difference.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters - Desktop */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="sticky top-20 space-y-6">
            <div>
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm font-normal cursor-pointer">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <div key={range.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`price-${range.value}`}
                      checked={priceRange.includes(range.value)}
                      onCheckedChange={() => togglePriceRange(range.value)}
                    />
                    <Label htmlFor={`price-${range.value}`} className="text-sm font-normal cursor-pointer">
                      {range.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Narrow down your product search</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Categories</h3>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-category-${category}`}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => toggleCategory(category)}
                            />
                            <Label
                              htmlFor={`mobile-category-${category}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-3">Price Range</h3>
                      <div className="space-y-2">
                        {priceRanges.map((range) => (
                          <div key={range.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mobile-price-${range.value}`}
                              checked={priceRange.includes(range.value)}
                              onCheckedChange={() => togglePriceRange(range.value)}
                            />
                            <Label
                              htmlFor={`mobile-price-${range.value}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {range.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button variant="outline" className="w-full" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="low">Price: Low to High</SelectItem>
                  <SelectItem value="high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategories.length > 0 || priceRange.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategories.map((category) => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {category}
                  <button className="ml-1 rounded-full hover:bg-muted p-0.5" onClick={() => toggleCategory(category)}>
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </button>
                </Badge>
              ))}

              {priceRange.map((range) => {
                const rangeLabel = priceRanges.find((r) => r.value === range)?.label
                return (
                  <Badge key={range} variant="secondary" className="flex items-center gap-1">
                    {rangeLabel}
                    <button className="ml-1 rounded-full hover:bg-muted p-0.5" onClick={() => togglePriceRange(range)}>
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </button>
                  </Badge>
                )
              })}

              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={resetFilters}>
                Clear All
              </Button>
            </div>
          )}

          {/* Products Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square relative">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-all hover:scale-105"
                    />
                    {product.featured && <Badge className="absolute top-2 right-2 bg-green-600">Featured</Badge>}
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center text-green-600 dark:text-green-400 font-medium">
                      <Award className="h-4 w-4 mr-1" /> {product.points} points
                    </div>
                    <Chatbot/>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/shop/product/${product.id}`}>View Details</Link>
                    </Button>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted rounded-lg">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria.</p>
              <Button variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

