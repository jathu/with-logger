import { logger } from "./index";

logger.info("👋 starting test");
const metadata = {
  userId: "2e01d247-1dc1-4d39-a287-f8a069544d43",
  location: "San Francisco, CA",
};
logger.with({ ...metadata }).debug("example debug");
logger.warn("example warn");
logger.trace("example trace");
logger.error("example error");
logger.log("done", metadata);
