import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod"

export async function createTrip(app: FastifyInstance) {
    const schema = ({
        body: z.object({
          destination: z.string().min(4),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
        }),
      });
    
    app.withTypeProvider<ZodTypeProvider>().post('/trips', {
        schema: schema,
    }, async (request) => {
        
        const { destination, starts_at, ends_at }: z.infer<typeof schema.body> = request.body as z.infer<typeof schema.body>;

        return {
            destination,
            starts_at,
            ends_at
        }
    }) 
}