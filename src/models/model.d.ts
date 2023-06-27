import { QueryResult } from 'pg'

// Describe entities that sit on top of the database
interface ModelStatic<Data, SQL> {
  fromSQL: (data: SQL) => Model<Data, SQL>;
  list: () => Promise<QueryResult<SQL>>;
  validate: (data: any) => Promise<Data>;
  serialize: (data: Data) => any;
  new (data: Data): Model<Data, SQL>;
}

interface Model<Data, SQL> {
  getObject: () => Data;
  insert: () => Promise<QueryResult<SQL>>;
}

export {
  Model, ModelStatic
}