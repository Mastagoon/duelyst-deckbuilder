// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from "@trpc/server/adapters/next"
import { appRouter } from "../../../server/router"
import { createContext } from "../../../server/router/context"

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createContext,
  responseMeta({ ctx, type, errors }) {
    // checking that no procedures errored
    const allOk = errors.length === 0
    // checking we're doing a query request
    const isQuery = type === "query"
    if (ctx?.res && allOk && isQuery) {
      // cache request for 1 day + revalidate once every second
      const ONE_DAY_IN_SECONDS = 60 * 60 * 24
      return {
        headers: {
          "cache-control": `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
        },
      }
    }
    return {}
  },
})
