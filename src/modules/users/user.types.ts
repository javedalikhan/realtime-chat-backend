export interface User {
    id: string;
    username: string;
    createdAt: Date;
}

export type DbUser = {
    id: string;
    username: string;
    created_at: string;
  } & Record<string, unknown>;