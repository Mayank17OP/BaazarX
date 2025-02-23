import { useState } from "react";
import { Product } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, MessageCircle, Star } from "lucide-react";
import { ChatRoom } from "./chat-room";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [showChat, setShowChat] = useState(false);

  return (
    <>
      <Card className="overflow-hidden group">
        <CardContent className="p-4">
          <div className="aspect-square bg-gray-100 rounded-lg mb-4 relative group-hover:scale-105 transition-transform duration-200">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
            <Badge className="absolute top-2 right-2 bg-white/80 text-primary">
              {product.category}
            </Badge>
          </div>
          <h3 className="font-medium text-lg mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-2xl font-bold text-primary">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                4.5 • {product.stock} in stock
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            className="flex-1"
            onClick={() => addToCart(product)}
            disabled={Number(product.stock) === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowChat(true)}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      {showChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <ChatRoom vendorId={product.vendorId} onClose={() => setShowChat(false)} />
        </div>
      )}
    </>
  );
}