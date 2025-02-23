import { db } from "./db";
import { eq, and } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";
import {
  users,
  products,
  orders,
  videoChats,
  type User,
  type Product,
  type Order,
  type VideoChat,
  type InsertUser,
  type InsertProduct,
  type InsertOrder,
  type InsertVideoChat
} from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User>;

  // Product operations
  getProducts(): Promise<Product[]>;
  getProductsByVendor(vendorId: number): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductsByMarket(marketId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrdersByCustomer(customerId: number): Promise<Order[]>;
  getOrdersByVendor(vendorId: number): Promise<Order[]>;
  updateOrderStatus(orderId: number, status: string): Promise<Order>;

  // New video chat methods
  createVideoChat(chat: InsertVideoChat): Promise<VideoChat>;
  getActiveVideoChats(userId: number): Promise<VideoChat[]>;
  endVideoChat(chatId: number): Promise<VideoChat>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [updated] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return db.select().from(products);
  }

  async getProductsByVendor(vendorId: number): Promise<Product[]> {
    return db.select().from(products).where(eq(products.vendorId, vendorId));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return db.select().from(products).where(eq(products.category, category));
  }

  async getProductsByMarket(marketId: number): Promise<Product[]> {
    return db.select().from(products).where(eq(products.marketId, marketId));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
    const [updated] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Order operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async getOrdersByCustomer(customerId: number): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.customerId, customerId));
  }

  async getOrdersByVendor(vendorId: number): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.vendorId, vendorId));
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const [updated] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, orderId))
      .returning();
    return updated;
  }

  // Video chat operations
  async createVideoChat(chat: InsertVideoChat): Promise<VideoChat> {
    const [newChat] = await db.insert(videoChats).values(chat).returning();
    return newChat;
  }

  async getActiveVideoChats(userId: number): Promise<VideoChat[]> {
    return db.select().from(videoChats).where(
      and(
        eq(videoChats.status, 'active'),
        eq(videoChats.customerId, userId)
      )
    );
  }

  async endVideoChat(chatId: number): Promise<VideoChat> {
    const [updated] = await db
      .update(videoChats)
      .set({ 
        status: 'ended',
        endedAt: new Date()
      })
      .where(eq(videoChats.id, chatId))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();