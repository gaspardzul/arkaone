import { PartialType } from '@nestjs/swagger';
import { CreateFollowUpTaskDto } from './create-follow-up-task.dto';

export class UpdateFollowUpTaskDto extends PartialType(CreateFollowUpTaskDto) {}
