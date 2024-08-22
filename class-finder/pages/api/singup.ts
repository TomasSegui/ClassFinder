
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function validateUserData(data: any) {
  const { email, password, username, profesor, pfp, profesion, carrera, desc, barrio, precio, materia, idsCampus } = data;

  if (typeof email !== 'string' || !email.includes('@')) {
    return { valid: false, message: 'Email inválido' };
  }
  if (typeof password !== 'string' || password.length < 6) {
    return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
  }
  if (typeof username !== 'string' || username.trim() === '') {
    return { valid: false, message: 'Nombre de usuario inválido' };
  }
  if (pfp && typeof pfp !== 'string') {
    return { valid: false, message: 'URL de perfil inválida' };
  }
  if (profesion && typeof profesion !== 'string') {
    return { valid: false, message: 'Profesión inválida' };
  }
  if (carrera && typeof carrera !== 'string') {
    return { valid: false, message: 'Carrera inválida' };
  }
  if (desc && typeof desc !== 'string') {
    return { valid: false, message: 'Descripción inválida' };
  }
  if (barrio && typeof barrio !== 'string') {
    return { valid: false, message: 'Barrio inválido' };
  }
  if (precio && typeof precio !== 'number') {
    return { valid: false, message: 'Precio inválido' };
  }
  if (materia && typeof materia !== 'string') {
    return { valid: false, message: 'Materia inválida' };
  }
  if (idsCampus && typeof idsCampus !== 'string') {
    return { valid: false, message: 'ID de campus inválido' };
  }

  return { valid: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password, username, profesor, pfp, profesion, carrera, desc, barrio, precio, materia, idsCampus } = req.body;

    const validation = validateUserData(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    try {
      const existingUser = await prisma.users.findUnique({
  where: { id: email },
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

      return res.status(201).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else {
    return res.status(405).json({ error: 'Método no permitido' });
  }
}
