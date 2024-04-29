import express from "express";
import path from "path";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cookieParser from "cookie-parser";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/uploads", uploadRoutes);

const __dirname = path.resolve();

app.use("/uploads", express.static(__dirname + "/uploads"));

if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static(__dirname + "/frontend/build"));

  // any route that is not api will be redirected to index.html
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

app.post("/webhook", (req, res) => {
  // Extracting the 'signature' header from the HTTP request
  const signature = req.get("signature");

  // Getting the raw payload from the request body
  const payload = JSON.stringify(req.body);

  // If there is no signature, ignore the request
  if (!signature) {
    return res.sendStatus(400);
  }

  // Calculate the signature
  const computedSignature = crypto
    .createHmac("sha256", process.env.CHARGILY_SECRET_KEY)
    .update(payload)
    .digest("hex");

  // If the calculated signature doesn't match the received signature, ignore the request
  if (computedSignature !== signature) {
    return res.sendStatus(403);
  }

  // If the signatures match, proceed to decode the JSON payload
  const event = req.body;

  // Switch based on the event type
  switch (event.type) {
    case "checkout.paid":
      const checkout = event.data;
      // Handle the successful payment.
      res.sendStatus(200);
      break;
    case "checkout.failed":
      const failedCheckout = event.data;
      // Handle the failed payment.
      break;
  }

  // Respond with a 200 OK status code to let us know that you've received the webhook
  res.sendStatus(200);
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
