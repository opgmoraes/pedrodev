import type { IncomingMessage, ServerResponse } from "node:http";
import { createProspectSearchMiddleware } from "../server/prospectSearchApi";

const middleware = createProspectSearchMiddleware(process.env);

export default async function prospectSearch(request: IncomingMessage, response: ServerResponse) {
  return middleware(request, response, () => {
    response.statusCode = 404;
    response.end();
  });
}
