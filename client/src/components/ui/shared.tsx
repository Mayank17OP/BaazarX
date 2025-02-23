import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./select";
import { Badge } from "./badge";
import { Avatar } from "./avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Progress } from "./progress";
import { Separator } from "./separator";
import { Switch } from "./switch";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Re-export all UI components from a single file
export {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Avatar,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Progress,
  Separator,
  Switch,
  useToast,
  cn
};

// Shared Layout Components
export const PageContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", className)}>
    {children}
  </div>
);

export const PageHeader = ({ title, description }: { title: string; description?: string }) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
    {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
  </div>
);

export const GridLayout = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
    {children}
  </div>
);

export const LoadingSkeleton = () => (
  <GridLayout>
    {[1, 2, 3, 4].map((i) => (
      <Card key={i} className="h-[400px] animate-pulse">
        <div className="h-48 bg-gray-200 rounded-t-lg" />
        <CardContent className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </CardContent>
      </Card>
    ))}
  </GridLayout>
);