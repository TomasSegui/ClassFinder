// import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async (req: any, res: any) => {
  if (req.method === 'POST') {
    const { email, password, username, profesor, pfp, profesion, carrera, desc, barrio, precio, materia, idsCampus } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
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

    res.status(201).json(user);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
