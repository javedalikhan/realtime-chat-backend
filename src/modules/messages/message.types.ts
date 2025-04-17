export interface Message {
    id: string;
    userId: string;
    username: string
    content: string;
    createdAt: Date;
}

export type DbMessage = {
    id: number;
    user_id: string;
    content: string;
    created_at: string;
    username: string;
  } & Record<string, unknown>;