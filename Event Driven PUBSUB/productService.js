import redis from "redis";
const publisher = redis.createClient({ url: "redis://localhost:6379" });

// Function to publish a message
function publishMessage(channel, message) {
  publisher.publish(channel, message, (err) => {
    if (err) {
      console.error(`Error publishing message: ${err.message}`);
      // Handle the error gracefully, and optionally close the client
      // publisher.quit();
    } else {
      console.log(`Message published to ${channel}: ${message}`);
    }
  });
}

// Example: Publish a message every 2 seconds
setInterval(() => {
  const message = `Event at ${new Date().toLocaleTimeString()}`;
  publishMessage("events", message);
}, 2000);
