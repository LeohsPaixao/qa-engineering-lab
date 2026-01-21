import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { full_name, social_name, doc_type, phone, email, document, password } = createUserDto;

    const existingDocument = await this.prisma.user.findUnique({
      where: { document },
    });

    if (existingDocument) {
      throw new ConflictException('CPF ou CNPJ já está em uso.');
    }

    const existingEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      throw new ConflictException('E-mail já está em uso.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        full_name,
        social_name: social_name || null,
        doc_type,
        phone: phone || null,
        email,
        document,
        password: hashedPassword,
      },
    });

    const result = Object.fromEntries(Object.entries(user).filter(([key]) => key !== 'password'));
    return result;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        full_name: true,
        email: true,
        document: true,
        phone: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!users || users.length === 0) {
      throw new NotFoundException('Nenhum usuário encontrado.');
    }

    return { users };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        full_name: true,
        social_name: true,
        email: true,
        phone: true,
        document: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com o ID: ${id} não encontrado.`);
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { full_name, social_name, phone } = updateUserDto;

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        full_name,
        social_name: social_name || null,
        phone: phone || null,
        updated_at: new Date(),
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado para atualizar.');
    }

    return user;
  }

  async deleteUsers(ids: number[], req?: any) {
    if (req && ids.includes(req.user.id)) {
      throw new HttpException('Você não pode excluir o usuário logado.', HttpStatus.BAD_REQUEST);
    }

    const result = await this.prisma.user.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('Nenhum usuário encontrado para excluir.');
    }

    return result;
  }
}
