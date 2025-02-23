import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { REGIONS } from "@shared/schema";

interface RegionSelectorProps {
  onSelect: (region: string, market: string) => void;
}

export function RegionSelector({ onSelect }: RegionSelectorProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);

  const markets = selectedRegion 
    ? REGIONS.find(r => r.name === selectedRegion)?.markets || []
    : [];

  return (
    <Card className="w-full max-w-md mx-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Select Your Location in Delhi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Select Region
          </label>
          <Select
            value={selectedRegion || ""}
            onValueChange={(value) => {
              setSelectedRegion(value);
              setSelectedMarket(null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a region" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((region) => (
                <SelectItem key={region.id} value={region.name}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedRegion && (
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Market
            </label>
            <Select
              value={selectedMarket || ""}
              onValueChange={setSelectedMarket}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a market" />
              </SelectTrigger>
              <SelectContent>
                {markets.map((market) => (
                  <SelectItem key={market} value={market}>
                    {market}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button
          className="w-full"
          disabled={!selectedRegion || !selectedMarket}
          onClick={() => {
            if (selectedRegion && selectedMarket) {
              onSelect(selectedRegion, selectedMarket);
            }
          }}
        >
          Continue Shopping
        </Button>
      </CardContent>
    </Card>
  );
}