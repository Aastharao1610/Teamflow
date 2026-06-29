import app  from "./app"
import redis from "./lib/redis"
const PORT = 3000;


redis.set("test_key", "Hello, Redis!").then(() => {
  console.log("Test key set in Redis");
}).catch((err) => {
  console.error("Error setting test key in Redis:", err);
});
app.listen(PORT , ()=>{
console.log("Server is runnig on port 3000")
})