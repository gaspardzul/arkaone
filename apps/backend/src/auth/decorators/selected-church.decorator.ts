import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SelectedChurch = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.selectedChurchId;
  },
);
