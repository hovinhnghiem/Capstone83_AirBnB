export interface BaseApiResponse<T> {
  statusCode: number;
  message: string;
  content: T;
  dateTime: string;
  messageConstants: null;
}
