import { addToast } from "@heroui/react";

export const notificationToast = ({
  message,
  title,
  type,
}: {
  message: string;
  title: string;
  type:
    | "default"
    | "foreground"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined;
}) => {
  addToast({
    title: title,
    description: message,
    color: type as
      | "default"
      | "foreground"
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "danger"
      | undefined,
  });
};

export const errorToast = (message: string, title: string = "Error") => {
  notificationToast({
    message,
    title,
    type: "danger",
  });
};
export const warningToast = (message: string, title: string = "Warning") => {
  notificationToast({
    message,
    title,
    type: "warning",
  });
};
export const successToast = (message: string, title: string = "Success") => {
  notificationToast({
    message,
    title,
    type: "success",
  });
};
