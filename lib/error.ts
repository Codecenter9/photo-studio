import axios from "axios";

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || err.message || "Axios request failed";
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "An unknown error occurred";
}

export function handleError(err: unknown): string {
  console.error(err);
  return getErrorMessage(err);
}