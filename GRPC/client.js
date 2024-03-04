const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObj.todoPackage;

//client connection
const client = new todoPackage.Todo(
  "localhost:8080",
  grpc.credentials.createInsecure()
);

// client.createTodo(
//   {
//     id: -1,
//     text: process.argv[2],
//   },
//   (err, response) => {
//     console.log(`Response from server ${JSON.stringify(response)}`);
//   }
// );

// client.readTodos({}, (err, response) => {
//   console.log(`Response from server ${JSON.stringify(response)}`);
// });

// Server stream
// const stream = client.readTodoStream();
// stream.on("data", (item) => {
//   console.log(`Received Item ${JSON.stringify(item)}`);
// });

// stream.on("end", (e) => console.log("Response Processed"));

//Client Stream
const stream = client.writeTodoStream();

stream.on("data", (item) => {
  console.log(`Received Item ${JSON.stringify(item)}`);
});

stream.on("error", (error) => {
  console.error(`Error from server: ${error.code} - ${error.details}`);
});

stream.on("end", () => {
  console.log("Server has completed processing the stream");
});

// Send multiple todo items to the server
stream.write({ id: -1, text: "Task 1" });
stream.write({ id: -1, text: "Task 2" });
stream.write({ id: -1, text: "Task 3" });

// Indicate the end of data
// stream.end();
