import cors from "@fastify/cors";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { confirmTrip } from "./routes/confirm-trip";
import { createTrip } from "./routes/create-trip";

const app = fastify()

app.register(cors, {
    origin: "*",
    
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip)
app.register(confirmTrip)

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