export const corsConfig = {
  origin: (origin, callback) => {
    const whitelist = [process.env.FRONTEND_URL]
    if (whitelist.includes(origin)) {
      return callback(null, true)
    }
    if (!origin) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  }
}
