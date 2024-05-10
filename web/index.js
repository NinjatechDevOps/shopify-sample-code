// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import { ShippingDB } from "./shipping-db.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);


const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/getShopSession", async (_req, res) => {
  res.status(200).send({ shopName: res.locals.shopify.session.shop });
});

app.post("/api/createShipping", async (_req, res) => {
  await ShippingDB.create(_req.body).then(result => {
    res.status(200).send({ message: "Shipping created...!!", data: result });
  }).catch(error => {
    res.status(500).send({ message: error })
  })
});


app.post("/api/updateShipping/:id", async (_req, res) => {
  await ShippingDB.update(_req.params.id, _req.body).then(result => {
    res.status(200).send({ message: "Shipping updated...!!", data: result });
  }).catch(error => {
    res.status(500).send({ message: error })
  })
});

app.post("/api/deleteShipping/:id", async (_req, res) => {
  await ShippingDB.delete(_req.params.id).then(result => {
    res.status(200).send({ message: "Shipping Deleted...!!", data: result });
  }).catch(error => {
    res.status(500).send({ message: error })
  })
});

app.get("/api/getShipping/:id", async (_req, res) => {
  await ShippingDB.read(_req.params.id).then(result => {
    res.status(200).send({ message: "Shipping Data...!!", data: result });
  }).catch(error => {
    res.status(500).send({ message: error })
  })
});

app.get("/api/getShippingList/:shopDomain", async (_req, res) => {
  await ShippingDB.list(_req.params.shopDomain).then(result => {
    res.status(200).send({ message: "Shipping Data List...!!", data: result });
  }).catch(error => {
    res.status(500).send({ message: error })
  })
});


app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
