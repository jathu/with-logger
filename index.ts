interface Logger {
  /**
   * A logger instance. Similar to console logger with some more context.
   *
   * @param message log message.
   * @param optionalParams objects with which to replace substitution strings
   * within message. This gives you additional control over the format of the
   * output.
   */
  (message?: any, ...optionalParams: any[]): void;
}

type Level = "trace" | "log" | "debug" | "info" | "warn" | "error";

const ansi = (code: number, message: string): string =>
  process.env.NO_COLOR
    ? message
    : ["\x1b[", code, "m", message, "\x1b[0m"].join("");

const zeroPad = (value: number, limit = 10) =>
  value < limit ? `0${value}` : value.toString();

const formattedTime = (now: Date): string =>
  ansi(
    2,
    [
      [now.getFullYear(), zeroPad(now.getMonth()), zeroPad(now.getDate())].join(
        "-",
      ),
      [
        [now.getHours(), now.getMinutes(), now.getSeconds()]
          .map((digit: number) => zeroPad(digit))
          .join(":"),
        zeroPad(now.getMilliseconds(), 100),
      ].join("."),
    ].join(" "),
  );

const formattedLogLevel = (level: Level): string => {
  switch (level) {
    case "trace":
    case "log":
      return ansi(37, level);
    case "debug":
      return ansi(32, "debug");
    case "info":
      return ansi(34, " info");
    case "warn":
      return ansi(33, " warn");
    case "error":
      return ansi(31, "error");
  }
};

const formattedContext = (context: { [key: string]: any }): string | null =>
  Object.keys(context)
    .map((key) => ansi(2, `[${key}=${context[key]}]`))
    .join(" ");

const logPrefix = (level: Level, context: { [key: string]: any }): string =>
  [
    formattedTime(new Date()),
    formattedLogLevel(level),
    formattedContext(context),
    ansi(2, ":"),
  ]
    .filter((component) => component)
    .join(" ");

const contextLogger = (context: {
  [key: string]: any;
}): { [key in Level]: Logger } => ({
  trace: (message?: any, ...optionalParams: any[]): void =>
    console.trace(logPrefix("trace", context), message, ...optionalParams),
  log: (message?: any, ...optionalParams: any[]): void =>
    console.log(logPrefix("log", context), message, ...optionalParams),
  debug: (message?: any, ...optionalParams: any[]): void =>
    console.debug(logPrefix("debug", context), message, ...optionalParams),
  info: (message?: any, ...optionalParams: any[]): void =>
    console.info(logPrefix("info", context), message, ...optionalParams),
  warn: (message?: any, ...optionalParams: any[]): void =>
    console.warn(logPrefix("warn", context), message, ...optionalParams),
  error: (message?: any, ...optionalParams: any[]): void =>
    console.error(logPrefix("error", context), message, ...optionalParams),
});

/**
 * Create a logger with some context. A context can be metadata relating to the
 * log or some other useful information. It will be logged inline with the log
 * line.
 *
 * @param context an object containing the metadata.
 * @returns an object of loggers.
 */
export const logger = { with: contextLogger, ...contextLogger({}) };
