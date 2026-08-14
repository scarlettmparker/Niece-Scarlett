export type QueryOperator =
  | "EQUALS"
  | "NOT_EQUALS"
  | "MATCHES"
  | "STARTS_WITH"
  | "ENDS_WITH"
  | "GREATER_THAN"
  | "LESS_THAN"
  | "GREATER_THAN_OR_EQUAL"
  | "LESS_THAN_OR_EQUAL"
  | "IN";

export interface QueryFilter {
  field: string;
  operator: QueryOperator;
  value: string;
}

export interface QuerySort {
  by: string;
  dir: "ASC" | "DESC";
}

export interface QuerySpec {
  page: number;
  size?: number;
  filters: QueryFilter[];
  sort?: QuerySort;
  search?: string;
}

export interface QueryFieldConfig {
  aliases: string[];
  operators?: QueryOperator[];
  defaultOperator?: QueryOperator;
  values?: Record<string, string>;
}

export interface QuerySortFieldConfig {
  aliases: string[];
  defaultDirection?: "ASC" | "DESC";
  aliasDirections?: Record<string, "ASC" | "DESC">;
}

export interface QuerySortConfig {
  default?: QuerySort;
  directionWords?: Partial<Record<"ASC" | "DESC", string[]>>;
  fields: Record<string, QuerySortFieldConfig>;
}

export interface QuerySchema {
  fields: Record<string, QueryFieldConfig>;
  sort?: QuerySortConfig;
  defaultSearchField?: string;
  searchOperator?: QueryOperator;
  pageAliases?: string[];
}
