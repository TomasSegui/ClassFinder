import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req:any, res:any) {
  if (req.method === 'POST') {
    const { email, password, username, profesor, pfp, profesion, carrera, desc, barrio, precio, materia, idsCampus } = req.body;

    try {
      const existingUser = await prisma.users.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'El usuario ya existe' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.users.create({
        data: {
          email,
          password: hashedPassword,
          username,
          profesor: profesor || false,
          pfp,
          profesion,
          carrera,
          desc: desc || "Hola, esta es mi descripción.",
          barrio,
          precio,
          materia,
          idsCampus
        },
      });

      return res.status(201).header('Content-Type', 'application/json').json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).header('Content-Type', 'application/json').json({ error: 'Error interno del servidor' });
    }
  } else {
    return res.status(405).header('Content-Type', 'application/json').json({ error: 'Método no permitido' });
  }
}
