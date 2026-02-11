import { message } from "antd";
import { ApiResponseError } from "components/Models/ApiResponseError";

export function HandleApiError(error: any) {
  if (error instanceof ApiResponseError) {
    if (error.detail) message.error(`${error.detail}`);
    else {
      let apiErrorMessages: string[] = error.errors!.messages;
      message.error(`${apiErrorMessages[0]}`);
    }
    return;
  } else {
    let err = error as Error;
    message.error(err.message);
  }
}
