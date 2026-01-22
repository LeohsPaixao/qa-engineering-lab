import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { DocType } from '../common/enums/doc-type';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome completo do usuário' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ description: 'Nome social do usuário', required: false })
  @IsOptional()
  @IsString()
  social_name?: string;

  @ApiProperty({ description: 'CPF ou CNPJ do usuário' })
  @IsString()
  @IsNotEmpty()
  document: string;

  @ApiProperty({ description: 'Tipo de documento (CPF ou CNPJ)', enum: DocType })
  @IsEnum(DocType)
  @IsNotEmpty()
  doc_type: DocType;

  @ApiProperty({ description: 'Telefone do usuário', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
