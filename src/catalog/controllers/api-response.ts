export class ApiResponse<T> {
  private timestamp: number;
  private status: number;
  private data?: T;
  private message?: string;

  private constructor(status: number, data?: T, message?: string) {
    this.timestamp = Date.now();
    this.status = status;
    this.data = data;
    this.message = message;
  }

  static success<T>(
    data: T,
    status: number = 200,
    message?: string,
  ): ApiResponse<T> {
    return new ApiResponse(status, data, message);
  }

  static error<T>(status: number, message: string, data?: T): ApiResponse<T> {
    return new ApiResponse(status, data, message);
  }
}
