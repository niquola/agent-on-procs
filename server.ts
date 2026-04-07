import { ctx } from "./ctx_start.ts";
import { router_buildRoutes } from "./router_buildRoutes.ts";

const routes = await router_buildRoutes(".", ctx);

Bun.serve({
  port: 3000,
  routes,
});

console.log("http://localhost:3000");
