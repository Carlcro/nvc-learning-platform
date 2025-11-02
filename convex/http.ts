import { httpRouter } from "convex/server";
import { auth } from "./auth";

const http = httpRouter();

// Register Convex Auth HTTP routes
// This exposes auth:signIn, auth:signOut, etc. endpoints
auth.addHttpRoutes(http);

export default http;
