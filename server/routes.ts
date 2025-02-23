import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertProductSchema, insertUserSchema } from "@shared/schema";
import { setupChatServer } from "./chat";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // API routes
  app.patch("/api/users/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.id !== Number(req.params.id)) {
      return res.status(403).send("Unauthorized");
    }

    const userData = insertUserSchema.partial().parse(req.body);
    const user = await storage.updateUser(Number(req.params.id), userData);
    res.json(user);
  });

  // API routes
  app.get("/api/products", async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/vendor/:id", async (req, res) => {
    const products = await storage.getProductsByVendor(Number(req.params.id));
    res.json(products);
  });

  app.get("/api/products/category/:category", async (req, res) => {
    const products = await storage.getProductsByCategory(req.params.category);
    res.json(products);
  });

  app.post("/api/products", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "vendor") {
      return res.status(403).send("Only vendors can create products");
    }

    const productData = insertProductSchema.parse(req.body);
    const product = await storage.createProduct({
      ...productData,
      vendorId: req.user.id,
    });
    res.status(201).json(product);
  });

  app.patch("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "vendor") {
      return res.status(403).send("Only vendors can update products");
    }

    const product = await storage.updateProduct(Number(req.params.id), req.body);
    res.json(product);
  });

  app.delete("/api/products/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "vendor") {
      return res.status(403).send("Only vendors can delete products");
    }

    await storage.deleteProduct(Number(req.params.id));
    res.sendStatus(204);
  });

  const httpServer = createServer(app);

  // Set up WebSocket chat server
  setupChatServer(httpServer);

  return httpServer;
}