import { MongoClient } from 'mongodb'

if (process.env.MONGODB_URI == null) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient | undefined
let clientPromise: Promise<MongoClient> | undefined

declare const global: {
  _mongoClientPromise?: Promise<MongoClient>
}

if (process.env.NODE_ENV === 'development') {
  if (global._mongoClientPromise == null) {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
    global._mongoClientPromise = clientPromise
  } else {
    clientPromise = global._mongoClientPromise
  }
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
