import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import type {Api} from "../../api/api.types.js";

export const createHonoApp = ({api}: {api: Api}) => {
  const chunks_names = Object.keys(api);

  const app = new Hono()
    .post('/:chunk_name', async (c) => {
      const chunk_name = c.req.param("chunk_name");
      if (!chunks_names.includes(chunk_name)) {
        return c.notFound()
      }
    
      const body = await c.req.json();
    
      const res = await api[chunk_name](body);
    
      return c.json(res);
    })
    .notFound((c) => c.json({ error: 'not found' }, 404))

  return app;
}

interface CreateHonoServerOpts {
  app: ReturnType<typeof createHonoApp>;
  port: string | number;
  name: string;
  onReady: () => void;
} 
type CreateHonoServer = (opts: CreateHonoServerOpts) => any;
export const createHonoServer: CreateHonoServer = ({app, port, name, onReady}) => {
  serve({
    fetch: app.fetch,
    port: typeof port == "string" ? parseInt(port) : port,
  }, (info) => {
    console.log(`${name || "Monolith"}, Initialization: Listening on port ${info.port}`);
    onReady();
  })
  
  return app;
}

