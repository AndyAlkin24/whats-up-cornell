
export interface Reply {
  id: string;
  post_id: string;
  message: string;
  timestamp: number;
  pullingup: number; // Changed from pullingUp to match database column name
  fade: number;
}
