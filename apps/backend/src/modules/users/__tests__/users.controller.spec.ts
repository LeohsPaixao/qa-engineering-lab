import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { DocType } from '../common/enums/doc-type';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('UserController', () => {
  let controller: UsersController;

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  it('Deve retornar uma lista de usuários', async () => {
    const mockUsers = [
      {
        id: 1,
        full_name: 'John Doe',
        email: 'john@example.com',
        document: '1234567890',
        phone: '1234567890',
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
      },
      {
        id: 2,
        full_name: 'Jane Smith',
        email: 'jane@example.com',
        document: '1234567890',
        phone: '1234567890',
        created_at: new Date('2024-01-02'),
        updated_at: new Date('2024-01-02'),
      },
    ];

    const expectedResult = { users: mockUsers };

    mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

    const result = await controller.findAll();
    expect(result).toEqual(expectedResult);
    expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        full_name: true,
        social_name: true,
        email: true,
        document: true,
        phone: true,
        created_at: true,
        updated_at: true,
      },
    });
  });

  it('Deve retornar erro quando nenhum usuário for encontrado', async () => {
    mockPrismaService.user.findMany.mockResolvedValue([]);

    await expect(controller.findAll()).rejects.toThrow('Nenhum usuário encontrado.');
  });

  it('Deve criar um novo usuário', async () => {
    const mockUserWithPassword = {
      id: 1,
      full_name: 'John Doe',
      email: 'john@example.com',
      social_name: 'John Doe',
      document: '1234567890',
      doc_type: DocType.CPF,
      phone: '1234567890',
      password: 'hashedPassword123',
      created_at: new Date(),
      updated_at: new Date(),
    };

    const mockUserWithoutPassword = {
      id: 1,
      full_name: 'John Doe',
      email: 'john@example.com',
      social_name: 'John Doe',
      document: '1234567890',
      doc_type: DocType.CPF,
      phone: '1234567890',
      created_at: new Date(),
      updated_at: new Date(),
    };

    mockPrismaService.user.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    mockPrismaService.user.create.mockResolvedValue(mockUserWithPassword);

    const createUserDto = {
      full_name: 'John Doe',
      social_name: 'John Doe',
      document: '1234567890',
      doc_type: DocType.CPF,
      phone: '1234567890',
      password: '123456',
      email: 'john@example.com',
    };

    const result = await controller.create(createUserDto);

    expect(result).toEqual({
      message: 'Usuário criado com sucesso!',
      user: mockUserWithoutPassword,
    });

    expect(mockPrismaService.user.create).toHaveBeenCalledWith({
      data: {
        full_name: 'John Doe',
        social_name: 'John Doe',
        document: '1234567890',
        doc_type: DocType.CPF,
        phone: '1234567890',
        email: 'john@example.com',
        password: expect.any(String),
      },
    });
  });

  it('Deve retornar erro se CPF/CNPJ já estiver em uso', async () => {
    const existingUser = {
      id: 1,
      document: '1234567890',
    };

    mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

    const createUserDto = {
      full_name: 'John Doe',
      social_name: 'John Doe',
      document: '1234567890',
      doc_type: DocType.CPF,
      phone: '1234567890',
      password: '123456',
      email: 'john@example.com',
    };

    await expect(controller.create(createUserDto)).rejects.toThrow('CPF ou CNPJ já está em uso.');
  });

  it('Deve retornar erro se email já estiver em uso', async () => {
    const existingUser = {
      id: 1,
      email: 'john@example.com',
    };

    mockPrismaService.user.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(existingUser);

    const createUserDto = {
      full_name: 'John Doe',
      social_name: 'John Doe',
      document: '1234567890',
      doc_type: DocType.CPF,
      phone: '1234567890',
      password: '123456',
      email: 'john@example.com',
    };

    await expect(controller.create(createUserDto)).rejects.toThrow('E-mail já está em uso.');
  });

  it('Deve retornar um usuário específico', async () => {
    const mockUser = {
      id: 1,
      full_name: 'John Doe',
      social_name: 'John Doe',
      document: '1234567890',
      email: 'john@example.com',
      phone: '1234567890',
      created_at: new Date(),
      updated_at: new Date(),
    };

    mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

    const req = { user: { id: 1 } };
    const result = await controller.getMe(req);

    expect(result).toEqual(mockUser);
    expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: {
        id: true,
        full_name: true,
        social_name: true,
        document: true,
        email: true,
        phone: true,
        created_at: true,
        updated_at: true,
      },
    });
  });

  it('Deve retornar erro se o usuário não for encontrado', async () => {
    mockPrismaService.user.findUnique.mockResolvedValue(null);

    const req = { user: { id: 1 } };
    await expect(controller.getMe(req)).rejects.toThrow('Usuário não encontrado.');
  });

  it('Deve atualizar um usuário', async () => {
    const mockUser = {
      id: 1,
      full_name: 'John Doe Updated',
      social_name: 'John Doe Updated',
      email: 'john@example.com',
      phone: '1234567890',
      created_at: new Date(),
      updated_at: new Date(),
    };

    mockPrismaService.user.update.mockResolvedValue(mockUser);

    const req = { user: { id: 1 } };
    const updateUserDto = {
      full_name: 'John Doe Updated',
      social_name: 'John Doe Updated',
      phone: '1234567890',
    };

    const result = await controller.update(req, updateUserDto);

    expect(result).toEqual({
      message: 'Usuário alterado com sucesso!',
      user: mockUser,
    });

    expect(mockPrismaService.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        full_name: 'John Doe Updated',
        social_name: 'John Doe Updated',
        phone: '1234567890',
        updated_at: expect.any(Date),
      },
    });
  });

  it('Deve deletar usuários', async () => {
    const mockDeleteResult = { count: 2 };

    mockPrismaService.user.deleteMany.mockResolvedValue(mockDeleteResult);

    const req = { user: { id: 3 } };
    const deleteUserDto = { ids: [1, 2] };

    const result = await controller.delete(deleteUserDto, req);

    expect(result).toEqual({
      message: '2 usuário(s) excluído(s) com sucesso!',
    });

    expect(mockPrismaService.user.deleteMany).toHaveBeenCalledWith({
      where: {
        id: { in: [1, 2] },
      },
    });
  });

  it('Deve retornar erro se tentar deletar o usuário logado', async () => {
    const req = { user: { id: 1 } };
    const deleteUserDto = { ids: [1, 2] };

    await expect(controller.delete(deleteUserDto, req)).rejects.toThrow('Você não pode excluir o usuário logado.');
  });

  it('Deve retornar erro quando nenhum usuário for encontrado para deletar', async () => {
    mockPrismaService.user.deleteMany.mockResolvedValue({ count: 0 });

    const req = { user: { id: 3 } };
    const deleteUserDto = { ids: [999, 998] };

    await expect(controller.delete(deleteUserDto, req)).rejects.toThrow('Nenhum usuário encontrado para excluir.');
  });
});
