import type { Attributes, CreationAttributes, FindOptions, Model, ModelStatic } from '@sequelize/core';
import type { BaseRepository } from './baseRepo';
import type { Transaction, WhereOptions } from '@sequelize/core';
import { NotFound, PaginatedResponse } from '../../utils';
import { Paginate } from '../../utils/paginate';

type Options = { t?: Transaction };

export default abstract class DefaultRepository<
  M extends Model,
  Query extends WhereOptions<M> & Partial<Attributes<M>> = WhereOptions<M> & Partial<Attributes<M>>,
> implements BaseRepository<Attributes<M>, CreationAttributes<M>> {
  abstract _model: ModelStatic<M>;

  async create(data: CreationAttributes<M>, options?: Options) {
    const record = await this._model.create(data, { transaction: options?.t });
    return record;
  }

  protected async __findOne(query: WhereOptions<M>, options?: Options) {
    const record = await this._model.findOne({
      where: query,
      transaction: options?.t,
    });
    if (!record) throw new NotFound(`${this._model.modelDefinition.modelName} not found!`);
    return record;
  }

  async update(query: Query, body: Partial<Attributes<M>>, options?: Options) {
    const record = await this.__findOne(query, options);
    record.set(body);
    await record.save({ transaction: options?.t });
    return record;
  }

  async delete(query: Query, options?: Options) {
    const record = await this.__findOne(query, options);
    await record.destroy({ transaction: options?.t });
    return record;
  }

  async findOne(query: WhereOptions<Attributes<M>> | Partial<Attributes<M>>, options?: Options & FindOptions<Attributes<M>>) {
    const record = await this._model.findOne({
      where: query as WhereOptions<Attributes<M>>,
      transaction: options?.t,
      ...options,
    });
    return record;
  }

  async upsert(body: CreationAttributes<M>) {
    const record = await this._model.upsert(body);
    return record;
  }

  async findById(id: string, options?: Options) {
    return await this.findOne({ id } as unknown as Query, options);
  }

  async find(query: Query, options?: Options) {
    const records = await this._model.findAll({
      where: query,
      transaction: options?.t,
    });
    return records;
  }

  async findWithPagination(
    _query:
      | ((WhereOptions<Attributes<M>> | Partial<Attributes<M>>) & { limit?: number | string; page?: number | string })
      | undefined,
    options?: Options & FindOptions<Attributes<M>>,
  ) {
    const { limit = 10, page = 1, ...query } = _query ?? {};
    const { order, t, ...otherOptions } = options ?? {};
    let { rows, count } = await this._model.findAndCountAll({
      where: query as WhereOptions<Attributes<M>>,
      limit: +limit || 10,
      offset: (+limit || 10) * ((+page || 1) - 1),
      order: order,
      transaction: t,
      ...otherOptions,
    });
    if (otherOptions?.include) {
      //@ts-ignore
      count = await this._model.count({ where: query as WhereOptions<Attributes<M>>, transaction: t });
    }
    const builder = Paginate.builder();
    builder
      .setData(rows)
      .setTotal(count)
      .setQueryParams({ limit: limit as string, page: page as string });
    return builder.build() as unknown as PaginatedResponse<M[]>;
  }
}
