import cors from "cors";
import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "..", "dist");
const port = process.env.PORT || 5050;
const mongoUri = process.env.MONGODB_URI;
const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;
const adminTokenSecret = process.env.ADMIN_TOKEN_SECRET;
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed by CORS."));
    },
  }),
);
app.use(express.json({ limit: "20kb" }));
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  );
  next();
});

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    service: {
      type: String,
      required: true,
      trim: true,
    },
    urgency: {
      type: String,
      required: true,
      enum: ["routine", "deadline", "notice"],
    },
    requirement: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true },
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);
const publicEnquiryFields = "name phone service urgency requirement status createdAt updatedAt";
const rateLimitBuckets = new Map();
const validServiceIds = new Set([
  "itr-filing",
  "gst-services",
  "tax-planning",
  "tax-notices",
  "nri-tax",
  "tds-tcs",
  "business-registration",
  "capital-gains",
]);

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function createRateLimiter({ maxRequests, windowMs }) {
  return (req, res, next) => {
    const forwardedFor = req.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : req.ip;
    const key = `${req.method}:${req.path}:${ip}`;
    const now = Date.now();
    const bucket = rateLimitBuckets.get(key);

    if (!bucket || bucket.expiresAt <= now) {
      rateLimitBuckets.set(key, { count: 1, expiresAt: now + windowMs });
      next();
      return;
    }

    if (bucket.count >= maxRequests) {
      res.status(429).json({ message: "Too many requests. Please try again later." });
      return;
    }

    bucket.count += 1;
    next();
  };
}

function safeCompare(value, expected) {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(valueBuffer, expectedBuffer);
}

const publicEnquiryLimiter = createRateLimiter({ maxRequests: 8, windowMs: 60 * 1000 });
const adminLoginLimiter = createRateLimiter({ maxRequests: 5, windowMs: 15 * 60 * 1000 });
const adminApiLimiter = createRateLimiter({ maxRequests: 120, windowMs: 60 * 1000 });

function createAdminToken(username) {
  const payload = {
    username,
    exp: Date.now() + 1000 * 60 * 60 * 8,
  };
  const payloadText = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", adminTokenSecret)
    .update(payloadText)
    .digest("base64url");

  return `${payloadText}.${signature}`;
}

function verifyAdminToken(token) {
  if (!token || !token.includes(".")) {
    return false;
  }

  const [payloadText, signature] = token.split(".");
  const expectedSignature = crypto
    .createHmac("sha256", adminTokenSecret)
    .update(payloadText)
    .digest("base64url");

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    )
  ) {
    return false;
  }

  const payload = JSON.parse(Buffer.from(payloadText, "base64url").toString("utf8"));
  return payload.exp > Date.now() && payload.username === adminUsername;
}

function requireAdmin(req, res, next) {
  const authHeader = req.get("Authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  try {
    if (verifyAdminToken(token)) {
      next();
      return;
    }
  } catch (_error) {
    // Invalid tokens should fall through to the same unauthorized response.
  }

  res.status(401).json({ message: "Admin access required." });
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/admin/login", adminLoginLimiter, (req, res) => {
  const username = cleanText(req.body.username);
  const password = cleanText(req.body.password);

  if (!adminUsername || !adminPassword) {
    return res.status(500).json({ message: "Admin credentials are not configured." });
  }

  if (!safeCompare(username, adminUsername) || !safeCompare(password, adminPassword)) {
    return res.status(401).json({ message: "Invalid admin credentials." });
  }

  return res.json({
    token: createAdminToken(username),
    admin: { username },
  });
});

app.post("/api/enquiries", publicEnquiryLimiter, async (req, res) => {
  try {
    const payload = {
      name: cleanText(req.body.name),
      phone: cleanText(req.body.phone),
      service: cleanText(req.body.service),
      urgency: cleanText(req.body.urgency),
      requirement: cleanText(req.body.requirement),
    };

    const missingFields = Object.entries(payload)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Please complete all required fields.",
        missingFields,
      });
    }

    if (!validServiceIds.has(payload.service)) {
      return res.status(400).json({ message: "Invalid service selected." });
    }

    if (!/^[0-9+\-\s()]{7,30}$/.test(payload.phone)) {
      return res.status(400).json({ message: "Please enter a valid phone number." });
    }

    const enquiry = await Enquiry.create(payload);

    return res.status(201).json({
      message: "Enquiry saved successfully.",
      enquiry,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Invalid enquiry details." });
    }

    console.error("Failed to save enquiry", error);
    return res.status(500).json({ message: "Could not save enquiry right now." });
  }
});

app.get("/api/admin/enquiries", adminApiLimiter, requireAdmin, async (_req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .select(publicEnquiryFields)
      .sort({ createdAt: -1 })
      .limit(100);
    const [totalRequests, newRequests, urgentRequests] = await Promise.all([
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: "new" }),
      Enquiry.countDocuments({ urgency: { $in: ["deadline", "notice"] } }),
    ]);

    return res.json({
      stats: {
        totalRequests,
        newRequests,
        urgentRequests,
      },
      enquiries,
    });
  } catch (error) {
    console.error("Failed to fetch enquiries", error);
    return res.status(500).json({ message: "Could not fetch enquiries right now." });
  }
});

app.patch("/api/admin/enquiries/:id", adminApiLimiter, requireAdmin, async (req, res) => {
  try {
    const status = cleanText(req.body.status);

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid enquiry id." });
    }

    if (!["new", "contacted", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid enquiry status." });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    ).select(publicEnquiryFields);

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found." });
    }

    return res.json({ message: "Enquiry updated successfully.", enquiry });
  } catch (error) {
    console.error("Failed to update enquiry", error);
    return res.status(500).json({ message: "Could not update enquiry right now." });
  }
});

app.delete("/api/admin/enquiries/:id", adminApiLimiter, requireAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid enquiry id." });
    }

    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found." });
    }

    return res.json({ message: "Enquiry deleted successfully." });
  } catch (error) {
    console.error("Failed to delete enquiry", error);
    return res.status(500).json({ message: "Could not delete enquiry right now." });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(distPath));
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

async function startServer() {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing. Add it to your .env file.");
  }

  if (!adminUsername || !adminPassword || !adminTokenSecret) {
    throw new Error("ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_TOKEN_SECRET are required.");
  }

  if (
    process.env.NODE_ENV === "production" &&
    (adminPassword === "change-this-password" ||
      adminTokenSecret === "change-this-token-secret" ||
      adminTokenSecret.length < 32)
  ) {
    throw new Error("Production admin credentials must be changed and ADMIN_TOKEN_SECRET must be at least 32 characters.");
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(mongoUri);
  console.log("MongoDB connected successfully.");

  app.listen(port, () => {
    console.log(`API server running on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
