import mongoose from 'mongoose'

export async function mongooseConnect() {
  if (process.env.MONGODB_URI == null) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  }
  const uri = process.env.MONGODB_URI
  if (mongoose.connection.readyState === 1) {
    return await mongoose.connection.asPromise()
  } else {
    return await mongoose.connect(uri)
  }
}
