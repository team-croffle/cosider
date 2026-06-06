import { IProject } from '../project';

import { EMimeType, ESchemaDataType } from './api-spec.enum';

export interface ISchemaPropertyDetail {
  type: ESchemaDataType;
  description: string | null;
  format: string | null;
  default: string | null;
  example: string | null;
  nullable: boolean; // default: false
  /** When type is STRING, this is the enum of the string */
  enum: string[] | null;
  /** When type is ARRAY, this is the schema of the items */
  items: ISchemaPropertyDetail | null;
  /** When type is OBJECT, this is the schema of the properties */
  properties: Record<string, ISchemaPropertyDetail> | null;
}

export interface ISchemaObject {
  type: string;
  required: string[]; // array of KEY which values are required(not null)
  properties: Record<string, ISchemaPropertyDetail> | null;
}

export interface IApiRequestSchema {
  path?: ISchemaObject;
  query?: ISchemaObject;
  header?: ISchemaObject;
  body?: ISchemaObject;
}

export interface IApiResponseSchema {
  description: string | null;
  contentType: EMimeType;
  schema: ISchemaPropertyDetail | null;
}

export interface IApiSpecification {
  id: string;
  projectId: Pick<IProject, 'id'>;
  method: string;
  endpointPath: string;
  summary: string;
  requestSchema: IApiRequestSchema;
  responseSchema: Record<string, IApiResponseSchema> | null;
}
