import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CATEGORIES, REGIONS, Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegionSelector } from "@/components/region-selector";
import { ProductCard } from "@/components/product-card";
import { CheckoutDrawer } from "@/components/checkout-drawer";
import { NavigationBar } from "@/components/navigation-bar";
import { useCart } from "@/hooks/use-cart";
import { ShoppingBag, Filter, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Marketplace() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [priceRange, setPriceRange] = useState<"all" | "low" | "medium" | "high">("all");
  const { cartItemCount, toggleCart } = useCart();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", selectedCategory, selectedMarket],
  });

  const filteredProducts = products.filter(product => {
    if (priceRange === "all") return true;
    const price = Number(product.price);
    switch (priceRange) {
      case "low": return price <= 1000;
      case "medium": return price > 1000 && price <= 5000;
      case "high": return price > 5000;
      default: return true;
    }
  });

  if (!selectedRegion || !selectedMarket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <RegionSelector 
          onSelect={(region, market) => {
            setSelectedRegion(region);
            setSelectedMarket(market);
          }} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedMarket} Marketplace
              </h1>
              <p className="text-sm text-gray-600">{selectedRegion}</p>
            </div>
            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Products</SheetTitle>
                  </SheetHeader>
                  <div className="py-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium">Price Range</label>
                      <Select
                        value={priceRange}
                        onValueChange={(value: any) => setPriceRange(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select price range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Prices</SelectItem>
                          <SelectItem value="low">Under ₹1,000</SelectItem>
                          <SelectItem value="medium">₹1,000 - ₹5,000</SelectItem>
                          <SelectItem value="high">Above ₹5,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <Button 
                variant="outline" 
                className="relative"
                onClick={toggleCart}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-8">
          <CardContent className="p-4">
            <Tabs 
              value={selectedCategory} 
              onValueChange={setSelectedCategory}
            >
              <TabsList className="w-full justify-start overflow-x-auto">
                {CATEGORIES.map((category) => (
                  <TabsTrigger key={category} value={category} className="whitespace-nowrap">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="h-80 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <CheckoutDrawer />
    </div>
  );
}