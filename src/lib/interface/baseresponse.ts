export interface BaseResponse<T> {
  message: string;
  success: boolean;
  data?: T;
}