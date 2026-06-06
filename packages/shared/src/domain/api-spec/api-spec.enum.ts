export enum ESchemaDataType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  INTEGER = 'INTEGER',
  BOOLEAN = 'BOOLEAN',
  OBJECT = 'OBJECT',
  ARRAY = 'ARRAY',
}

export enum EMimeType {
  APPLICATION_JSON = 'application/json',
  MULTIPART_FORM_DATA = 'multipart/form-data',
  APPLICATION_X_WWW_FORM_URLENCODED = 'application/x-www-form-urlencoded',
  APPLICATION_XML = 'application/xml',
  TEXT_XML = 'text/xml',
  APPLICATION_OCTET_STREAM = 'application/octet-stream',
  APPLICATION_MSGPACK = 'application/msgpack',
  TEXT_PLAIN = 'text/plain',
  TEXT_HTML = 'text/html',
  APPLICATION_JAVASCRIPT = 'application/javascript',
  APPLICATION_GRPC = 'application/grpc',
  APPLICATION_SOAP_XML = 'application/soap+xml',
  TEXT_EVENT_STREAM = 'text/event-stream',
  IMAGE = 'image/*',
  APPLICATION_PDF = 'application/pdf',
}
export enum EHttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  TRACE = 'TRACE',
  CONNECT = 'CONNECT',
  PROPFIND = 'PROPFIND',
  PROPPATCH = 'PROPPATCH',
  MKCOL = 'MKCOL',
  COPY = 'COPY',
  MOVE = 'MOVE',
  LOCK = 'LOCK',
  UNLOCK = 'UNLOCK',
  PURGE = 'PURGE',
  QUERY = 'QUERY',
}

export enum EApiReqSyncStatus {
  UPDATED = 'UPDATED',
  OUTDATED = 'OUTDATED',
}

export enum EParamsLocation {
  QUERY = 'query',
  PATH = 'path',
  HEADER = 'header',
  COOKIE = 'cookie',
}
