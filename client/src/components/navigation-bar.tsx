import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Home, LogOut, ShoppingBag, User, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { ProfileDialog } from "./profile-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { DELHI_MARKETS } from "@shared/schema";

export function NavigationBar() {
  const [location, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);

  const handleMarketChange = (market: string) => {
    setSelectedMarket(market);
    setLocation("/");
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {location !== "/" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.history.back()}
                aria-label="Go back"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              className="text-xl font-bold text-primary"
              onClick={() => setLocation("/")}
            >
              <Home className="h-5 w-5 mr-2" />
              BazaarX
            </Button>
            {user?.userType === "customer" && (
              <div className="flex items-center gap-2 ml-4">
                <MapPin className="h-4 w-4 text-primary" />
                <Select
                  value={selectedMarket || ""}
                  onValueChange={handleMarketChange}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Select market" />
                  </SelectTrigger>
                  <SelectContent>
                    {DELHI_MARKETS.map((market) => (
                      <SelectItem key={market} value={market}>
                        {market}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, {user.firstName}
                </span>
                <Button
                  variant="ghost"
                  onClick={() => setShowProfile(true)}
                >
                  <User className="h-5 w-5 mr-2" />
                  My Profile
                </Button>
                {user.userType === "vendor" && (
                  <Button
                    variant="ghost"
                    onClick={() => setLocation("/vendor")}
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Dashboard
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      {showProfile && <ProfileDialog onClose={() => setShowProfile(false)} />}
    </div>
  );
}