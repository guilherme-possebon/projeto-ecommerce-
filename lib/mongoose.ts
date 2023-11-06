import mongoose from 'mongoose'

export async function mongooseConnect() {
  const uri =
    'mongodb+srv://ecommerceteste:ecommerceteste123@cluster0.vll1azm.mongodb.net/?retryWrites=true&w=majority'
  if (mongoose.connection.readyState === 1) {
    return await mongoose.connection.asPromise()
  } else {
    return await mongoose.connect(uri)
  }
}
