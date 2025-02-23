import { pgTable, text, serial, integer, decimal, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  userType: text("user_type").notNull(), // 'vendor' or 'customer'
  shopAddress: text("shop_address"),
  shopCategory: text("shop_category"),
  shopName: text("shop_name"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull(),
  category: text("category").notNull(),
  images: text("images").array().notNull(),
  marketId: integer("market_id").notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("4.50"),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  vendorId: integer("vendor_id").notNull(),
  status: text("status").notNull(), // 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull()
});

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  read: boolean("read").default(false).notNull()
});

export const videoChats = pgTable("video_chats", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull(),
  vendorId: integer("vendor_id").notNull(),
  status: text("status").notNull(), // 'pending', 'active', 'ended'
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  recordingUrl: text("recording_url"),
});

export const REGIONS = [
  { 
    id: 1, 
    name: "North Delhi",
    markets: ["Chandni Chowk", "Kamla Nagar", "Model Town"]
  },
  { 
    id: 2, 
    name: "South Delhi",
    markets: ["Lajpat Nagar", "Sarojini Nagar", "Defence Colony"]
  },
  { 
    id: 3, 
    name: "East Delhi",
    markets: ["Laxmi Nagar", "V3S Mall", "Cross River Mall"]
  },
  {
    id: 4,
    name: "West Delhi", 
    markets: ["Rajouri Garden", "Janakpuri", "Punjabi Bagh"]
  }
];

export const DELHI_MARKETS = [
  "Chandni Chowk",
  "Sarojini Nagar", 
  "Karol Bagh",
  "Janpath"
] as const;

export const CATEGORIES = [
  "Fashion & Clothing",
  "Electronics",
  "Home & Kitchen",
  "Food & Groceries",
  "Health & Beauty",
  "Books & Stationery",
  "Jewelry & Accessories",
  "Sports & Fitness"
];

export const SAMPLE_SHOPS = [
  {
    name: "Fashion Hub",
    category: "Fashion & Clothing",
    market: "Chandni Chowk",
    description: "Traditional and modern clothing store"
  },
  {
    name: "Tech World",
    category: "Electronics",
    market: "Lajpat Nagar",
    description: "Latest gadgets and accessories"
  },
  // Add more sample shops...
];

export const insertUserSchema = createInsertSchema(users);
export const insertProductSchema = createInsertSchema(products);
export const insertOrderSchema = createInsertSchema(orders);
export const insertOrderItemSchema = createInsertSchema(orderItems);
export const insertChatSchema = createInsertSchema(chats);
export const insertVideoChatSchema = createInsertSchema(videoChats);

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type InsertChat = z.infer<typeof insertChatSchema>;
export type InsertVideoChat = z.infer<typeof insertVideoChatSchema>;
export type LoginData = z.infer<typeof loginSchema>;

export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Chat = typeof chats.$inferSelect;
export type VideoChat = typeof videoChats.$inferSelect;