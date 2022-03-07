const statusCodeToClassname = (statusCode: number): "success" | "danger" => {
  return statusCode > 199 && statusCode < 300 ? "success" : "danger";
};

export default statusCodeToClassname;
