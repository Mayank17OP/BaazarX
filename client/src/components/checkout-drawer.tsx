import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";


const PAYMENT_METHODS = [
  { id: "cod", name: "Cash on Delivery" },
  { id: "upi", name: "UPI" },
  { id: "card", name: "Credit/Debit Card" },
  { id: "wallet", name: "Digital Wallet" },
];

export function CheckoutDrawer() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isOpen, toggleCart, items, total, removeFromCart } = useCart(); // Added removeFromCart
  const [useDefaultAddress, setUseDefaultAddress] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const priceInRupees = total * 82.75; // Using a fixed conversion rate

  const handleCheckout = () => {
    const checkoutWindow = window.open("/checkout", "_blank", "width=800,height=600");
    if (checkoutWindow) {
      checkoutWindow.focus();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {items.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty</p>
          ) : (
            <>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{(Number(item.product.price) * 83 * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-500">₹{(Number(item.product.price) * 83).toFixed(2)} each</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.product.id)}> {/*Using existing removeFromCart*/}
                      Delete
                    </Button>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between text-lg font-medium">
                  <span>Total</span>
                  <span>₹{priceInRupees.toFixed(2)}</span>
                </div>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}