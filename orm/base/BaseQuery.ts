
import { Pool, ResultSetHeader } from "mysql2/promise";
import { getConnection } from "./connection";
import Logger from "@coding-flavour/logger";

type Fields = {
  [ key: string ]: any;
}

export enum baseSortOptions {
  ASC = 'ASC',
  DESC = 'DESC'
}
class BaseQuery<T extends Fields> {
  protected table: string = "";
  protected fields: T = {} as T;
  protected primaryKey: string = "id";
  private connection: Pool;
  private logger;

  constructor(connectFn = getConnection) {
    this.connection = connectFn();
    this.logger = Logger();
  }

  getFields() {
    return this.fields;
  }

  async insert(values: T) {
    const tableName = this.table;

    const newPair = this.buildNewPair(values);
    const insertQuery = `INSERT INTO ${tableName} (${Object.keys(newPair).join(", ")}) VALUES (${Object.values(newPair).join(", ")})`;
    this.logger.debug('Generated query', { generatedQuery: insertQuery })

    return await this.connection.query(insertQuery);
  }

  // Lets make sure the developer wants to erase by asking for all fields
  async delete(values: T) {
    const tableName = this.table;

    const newPair = this.buildNewPair(values);
    const whereTemplate = Object.keys(newPair).map(field => `${field} = ${newPair[ field ]}`).join(" AND ");
    const deleteQuery = `DELETE FROM ${tableName} WHERE ${whereTemplate}`;
    this.logger.debug('Generated query', { generatedQuery: deleteQuery })

    return await this.connection.query(deleteQuery);
  }

  async query<T>(query: string) {
    return await this.connection.query<ResultSetHeader & T>(query);
  }

  async getByPk(pkValue: number | string) {
    const [ primaryValue ] = await this.query<T[]>(`SELECT * FROM ${this.table} WHERE ${this.primaryKey} = ${pkValue}`);

    return primaryValue[ 0 ];
  }

  private cleanValue(value: unknown) {
    return typeof value === 'string' || value === 0 ? `'${value}'` : value;
  }

  async getAllByField(field: keyof T, value: string | number, orderBy?: unknown) {
    const [ rows ] = await this.query<T[]>(`SELECT * FROM ${this.table} WHERE ${String(field)} = ${this.cleanValue(value)} ${this.getOrderBy(orderBy)}`);

    return rows;
  }

  getOrderBy(sortBy: unknown, sortField?: unknown) {
    switch (sortBy) {
      case baseSortOptions.ASC:
        return `ORDER BY ${sortField} ASC`
      case baseSortOptions.DESC:
        return `ORDER BY ${sortField} DESC`
      default:
        return ''
    }
  }

  getLimit(limit: unknown) {
    return limit ? `LIMIT ${limit}` : ''
  }

  async getAll(sortField?: keyof T, orderBy?: string, limit?: number) {
    const [ rows ] = await this.query<T[]>(`SELECT * FROM ${this.table} ${this.getOrderBy(orderBy, sortField)} ${this.getLimit(limit)}`);
    return rows;
  }

  private buildNewPair(values: T): Fields {
    return Object.keys(this.getFields()).reduce((acc, field) => {
      const value = this.cleanValue(values[ field ]);

      if (!value) {
        throw new Error(`Field ${field} is required in ${this.table} table`);
      }

      return {
        ...acc,
        [ field ]: value,
      }
    }, {});
  }
}

export default BaseQuery;