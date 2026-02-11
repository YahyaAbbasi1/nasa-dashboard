export class ApiResponseError extends Error {
  errors?: { [messages: string]: string[] };
  detail: string;
  type?: string;
  title?: string;
  status?: string;
  traceId?: string;
  constructor(apiErrorResponse: ApiResponseError) {
    super();
    let index: string = apiErrorResponse.errors
      ? Object.keys(apiErrorResponse.errors)[0]
      : "-1";
    let errorMessages: string[] = apiErrorResponse.errors
      ? apiErrorResponse.errors[index]
      : [];
    this.errors = { messages: errorMessages };
    this.detail = apiErrorResponse.detail;
    this.type = apiErrorResponse.type;
    this.title = apiErrorResponse.title;
    this.status = apiErrorResponse.status;
    this.traceId = apiErrorResponse.traceId;
  }
}
