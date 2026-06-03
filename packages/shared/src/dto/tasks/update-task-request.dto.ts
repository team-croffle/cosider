import { PartialType } from '@nestjs/swagger';

import { CreateNewTaskRequestDto } from './create-new-task-request.dto';

export class UpdateTaskRequestDto extends PartialType(CreateNewTaskRequestDto) {}
