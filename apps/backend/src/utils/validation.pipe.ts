import { BadRequestException, Injectable, ValidationError, ValidationPipe } from '@nestjs/common';

/**
 * CustomValidationPipe é uma classe que estende a funcionalidade do ValidationPipe do NestJS para fornecer mensagens de erro de validação mais detalhadas e personalizadas.
 * Ela sobrescreve o método createException para formatar as mensagens de erro de validação em um formato específico, incluindo uma lista de mensagens de erro, o tipo de erro e o código de status HTTP.
 */
@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  createException(failedValidation: ValidationError[]) {
    const messages = failedValidation.map((err) => {
      return Object.values(err.constraints || {}).join(', ');
    });

    return new BadRequestException({
      message: messages,
      error: 'Bad Request',
      statusCode: 400,
    });
  }
}
