
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, total } = useCart();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Payment Successful!",
      description: "Your order has been placed.",
    });
    
    setProcessing(false);
    window.close();
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Card Number</label>
                <Input placeholder="4242 4242 4242 4242" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Expiry Date</label>
                  <Input placeholder="MM/YY" />
                </div>
                <div>
                  <label className="text-sm font-medium">CVV</label>
                  <Input placeholder="123" type="password" />
                </div>
              </div>
              <Button 
                className="w-full" 
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
