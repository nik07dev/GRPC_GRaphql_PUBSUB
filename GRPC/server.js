const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObj = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObj.todoPackage;

const server = new grpc.Server();

server.bindAsync(
  "0.0.0.0:8080",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error(`Error binding server to port: ${err}`);
    } else {
      console.log(`Server is now bound to port ${port}`);
    }
  }
);

server.addService(todoPackage.Todo.service, {
  createTodo: createTodo,
  readTodos: readTodos,
  readTodoStream: readTodoStream,
  writeTodoStream: writeTodoStream,
});

const todos = [];

function createTodo(call, callback) {
  const { text } = call.request;
  const todoItem = { id: todos.length + 1, text };
  todos.push(todoItem);
  callback(null, todoItem);
}

function readTodos(call, callback) {
  callback(null, { items: todos });
}

function readTodoStream(call, callback) {
  todos.forEach((item) => call.write(item));
  call.end();
}

function writeTodoStream(call, callback) {
  call.on("data", (request) => {
    // Handle each incoming data chunk
    todos.push({ id: todos.length + 1, text: request.text });
  });

  call.on("end", () => {
    // Client has finished sending data
    callback(null, { message: "Todos recorded successfully" });
  });

  call.on("error", (error) => {
    // Handle errors from the client
    console.error(`Error from client: ${error}`);
  });

  call.on("cancelled", () => {
    // Handle cancellation if the client cancels the stream
    console.log("Client cancelled the stream");
  });

  todos.forEach((item) => call.write(item));
  call.end();
}
