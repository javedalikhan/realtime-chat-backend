import { camelizeKeys } from 'humps';

export function toCamelArray<TInput extends Record<string, unknown>, TOutput>(
  rows: TInput[]
): TOutput[] {
  return rows.map((row) => camelizeKeys(row) as TOutput);
}

export function toCamel<TInput extends Record<string, unknown>, TOutput>(
  row: TInput
): TOutput {
  return camelizeKeys(row) as TOutput;
}