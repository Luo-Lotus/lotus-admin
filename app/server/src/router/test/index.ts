import { observable } from '@trpc/server/observable';
import { router } from '@server/initTRPC';
import zod from 'zod';
import publicProcedure from '@server/procedure/public';
import authProcedure from '../../procedure/auth';

const nestedRouter = router({
  nestedTest: publicProcedure.query(() => {
    return '嵌套路由测试';
  }),
});
zod.object({
  name: zod.string(),
});
const testRouter = router({
  /** 无权限接口测试 */
  authTest: authProcedure
    .meta({
      permission: 543,
    })
    .query(() => null),
  webSocketTest: publicProcedure.subscription(() => {
    let time = 0;
    return observable((emit) => {
      const timer = setInterval(() => {
        emit.next(time++);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    });
  }),
});

export default testRouter;
