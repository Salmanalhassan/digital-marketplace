const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();


const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const shopRoutes = require("./routes/shopRoutes");
const productRoutes = require("./routes/productRoutes");
const publicRoutes = require("./routes/publicRoutes");
const orderRoutes = require("./routes/orderRoutes");
const vendorOrderRoutes =require("./routes/vendorOrderRoutes");
const vendorProductRoutes =require("./routes/vendorProductRoutes");
const vendorShopRoutes =require("./routes/vendorShopRoutes");
const vendorSettingsRoutes =require("./routes/vendorSettingsRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const adminVendorRoutes = require("./routes/adminVendorRoutes");
const adminVendorDetailsRoutes =require("./routes/adminVendorDetailsRoutes");
const adminShopRoutes = require("./routes/adminShopRoutes");
const adminProductRoutes = require("./routes/adminProductRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const adminSettingsRoutes =require("./routes/adminSettingsRoutes");

const app = express();
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/products", productRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/vendor/orders",vendorOrderRoutes);
app.use("/api/vendor/products",vendorProductRoutes);
app.use("/api/vendor/shop",vendorShopRoutes);
app.use("/api/vendor/settings",vendorSettingsRoutes);
app.use("/api/admin/dashboard",adminDashboardRoutes);
app.use("/api/admin/vendors",adminVendorRoutes);
app.use("/api/admin/vendor-details",adminVendorDetailsRoutes);
app.use("/api/admin/shops",adminShopRoutes);
app.use( "/api/admin/products", adminProductRoutes );
app.use("/api/admin/orders",adminOrderRoutes);
app.use("/api/admin/settings",adminSettingsRoutes);

//app.get("/", (req, res) => {
  //  res.json({
    //    message: "Digital Marketplace API is running!"
    //});
//});

app.get("/", (req, res) => {
    res.json({
        success: true,
        project: "DIGITAL MARKETPLACE",
        message: "Digital Marketplace API is running!",
        server: "digital-marketplace-v1"
    });
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});