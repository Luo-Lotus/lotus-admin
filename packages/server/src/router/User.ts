import publicProcedure from '../procedures/public';
import { router } from '@server/initTRPC';
import z from 'zod';
import prisma from '../repositories';
import JWTUtil from '../utils/JWTUtil';
import _ from 'lodash';
import { exclude, paramsToFilter } from '../utils/objectUtils';
import { throwTRPCBadRequestError } from '../utils/ErrorUtil';
import authProcedure from '../procedures/auth';
import {
  AccountSchema,
  DateRangeSchema,
  SortOrderSchema,
  UserOptionalDefaults,
  UserOptionalDefaultsSchema,
  UserOriginSchema,
  UserPartialSchema,
  UserSchema,
} from '../constants/zodSchema';
import AuthTree from '@bta/common/AuthTree';
import userServer from '../services/User';
import { Prisma } from '@prisma/client';
import { createQueryRouterInputSchema } from '../utils/zodUtil';

const userRouter = router({
  signIn: publicProcedure
    .input(
      AccountSchema.pick({
        password: true,
        account: true,
      }),
    )
    .mutation(async ({ input: { password, account } }) => {
      return userServer.signIn(password, account);
    }),
  getUserInfoByToken: authProcedure.query(({ ctx }) => {
    console.log(ctx.user);
    return ctx.user;
  }),
  queryUsers: authProcedure
    .meta({
      permission: AuthTree.userModule.code,
    })
    .input(
      createQueryRouterInputSchema(
        UserOriginSchema.partial().merge(
          z.object({
            createAt: DateRangeSchema,
            updateAt: DateRangeSchema,
          }),
        ),
      ),
    )
    .query(async ({ input: { sort, filter, page } }) => {
      const filterParams = paramsToFilter(filter || {});
      const result = await prisma.$transaction([
        prisma.user.findManyWithoutDelete({
          skip: (page.current - 1) * page.pageSize,
          take: page.pageSize,
          orderBy: sort,
          where: filterParams,
        }),
        prisma.user.count({
          where: filterParams,
        }),
      ]);
      return {
        data: result[0],
        count: result[1],
      };
    }),

  updateUser: authProcedure
    .meta({
      permission: AuthTree.userModule.update.code,
    })
    .input(UserPartialSchema.required({ id: true, version: true }))
    .mutation(async ({ input: user }) => {
      await prisma.user.updateWithVersion({
        where: {
          id: user.id,
        },
        data: user,
      });
    }),

  createUser: authProcedure
    .meta({
      permission: AuthTree.userModule.create.code,
    })
    .input(UserOptionalDefaultsSchema)
    .mutation(async ({ input }) => {
      await prisma.user.create({
        data: input,
      });
    }),

  deleteUser: authProcedure
    .meta({
      permission: AuthTree.userModule.delete.code,
    })
    .input(UserSchema.pick({ id: true, version: true }))
    .mutation(async ({ input }) => {
      const res = await prisma.user.softDelete(input);
    }),
});

export default userRouter;
