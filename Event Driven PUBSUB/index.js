import { productInStockService, publisher } from "./productService.js";

const run = async () => {
  // Trigger the 'productInStock' event when a product is updated
  await productInStockService(123);

  // Properly close the Redis client when the application is shutting down
  process.on("SIGINT", async () => {
    await publisher.quit();
    console.log("Redis publisher closed.");
    process.exit();
  });
};

run();
