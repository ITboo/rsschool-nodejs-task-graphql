import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {

    return reply.send(fastify.db.posts.findMany());

  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {

      const post = await fastify.db.posts.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (post === null) {
        throw fastify.httpErrors.notFound('Post not found');
      };

      return reply.send(post);
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {

      const newPost = await fastify.db.posts.create(request.body);

      return reply.send(newPost);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {

      const deletedPost = await fastify.db.posts.delete(request.params.id);

      return reply.send(deletedPost);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {

      const updatedPost = await fastify.db.posts.change(
        request.params.id,
        request.body
      );

      return reply.send(updatedPost);
    }
  );
};

export default plugin;
