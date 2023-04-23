import mongoose from 'mongoose'

export function mongooseConnect() {
  const uri =
    'mongodb+srv://ecommerceteste:ecommerceteste123@cluster0.vll1azm.mongodb.net/?retryWrites=true&w=majority'
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise()
  } else {
    return mongoose.connect(uri)
  }
}
