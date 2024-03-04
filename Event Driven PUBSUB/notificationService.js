import redis from "redis";

const subscriber = redis.createClient({ url: "redis://localhost:6379" });

// Function to subscribe to a channel
function subscribeToChannel(channel) {
  subscriber.subscribe(channel);
  console.log(`Subscribed to ${channel} channel`);
}

// Handle incoming messages
subscriber.on("message", (channel, message) => {
  console.log(`Received message from ${channel}: ${message}`);
});

// Example: Subscribe to the 'events' channel
subscribeToChannel("events");
