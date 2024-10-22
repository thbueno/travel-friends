import dayjs from "dayjs";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import nodemailer from 'nodemailer';
import { z } from "zod";
import { getMailclient } from "../lib/mail";
import { prisma } from "../lib/prisma";

export async function createTrip(app: FastifyInstance) {
    const schema = ({
        body: z.object({
          destination: z.string().min(4),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
          owner_name: z.string(),
          owner_email: z.string().email(),
          emails_to_invite: z.array(z.string().email()),
        }),
      });
    
    app.withTypeProvider<ZodTypeProvider>().post('/trips', {
        schema: schema,
    }, async (request) => {
        
        const { destination, starts_at, ends_at, owner_name, owner_email, emails_to_invite }: z.infer<typeof schema.body> = request.body as z.infer<typeof schema.body>;

        if(dayjs(starts_at).isBefore(new Date())) {
            throw new Error('Starts trip date must be in the future')
        }

        if(dayjs(ends_at).isBefore(starts_at)) {
            throw new Error('Ends trip date must be after starts trip date')
        }

        const trip = await prisma.trip.create({
            data: {
                destination,
                starts_at,
                ends_at,
                participants: { 
                   createMany: {
                       data: [
                        {
                            name: owner_name, 
                            email: owner_email,
                            is_owner: true,
                            is_confirmed: true,
                        },
                        ...emails_to_invite.map(email => {
                            return { email }
                        })



                       ],
                   }
                },
            }
        })

        const mail = await getMailclient()

       const message = await mail.sendMail({
            from: {
                name: 'Equipe Travel friends',
                address: 'equipe@travelfriends.com'
            },

            to: {
                name: owner_name,
                address: owner_email,
            },
            subject: 'Sua viagem foi criada',
            html: `Olá ${owner_name}, Sua viagem foi criada com sucesso!`
            
        })

        console.log(nodemailer.getTestMessageUrl(message))

        return { tripId: trip.id }
    }) 
}