import fastify from "fastify";
import { prisma } from "./lib/prisma";
import { create } from "domain";
import { createTrip } from "./routes/create-trip";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

const app = fastify()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip)

// app.get('/cadastrar', async() => {
//     await prisma.trip.create({
//         data: {
//             destination: 'Camboja',
//             starts_at: new Date(),
//             ends_at: new Date(),
//         }
//     })

//     return 'Registro cadastrado com sucesso!'
// })

// app.get('/listar', async() => {
//     const trips = await prisma.trip.findMany()

//     return trips
// })


app.listen({ port: 3333 }).then(() => {
    console.log('server Running!')
})