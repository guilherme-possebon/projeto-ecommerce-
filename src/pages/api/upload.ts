import type { NextApiRequest, NextApiResponse } from 'next'
import multiparty from 'multiparty'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import fs from 'fs'
import mime from 'mime-types';

const regionAws = 'us-east-1'
const bucketName = 'teste-1234'

interface FormResult {
  fields: {
    [key: string]: string | string[]
  }
  files: {
    [key: string]: {
      fieldName: string
      originalFilename: string
      path: string
      headers: { [key: string]: string }
      size: number
      type: string
    }[]
  }
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = new multiparty.Form()
  const { fields, files } = await new Promise<FormResult>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      resolve({ fields, files })
    })
  })
  console.log('teste', files.file.length)
  const client = new S3Client({
    region: regionAws,
    credentials: {
      accessKeyId: process.env.S3_ACESS_KEY as string,
      secretAccessKey: process.env.S3_SECRET_ACESS_KEY as string
    }
  })
  const links = [];
  for (const file of files.file) {
    const ext = file.originalFilename.split('.').pop()
    const newFileName = Date.now() + '.' + ext
    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: newFileName,
        Body: fs.readFileSync(file.path),
        ACL: 'public-read',
        ContentType: mime.lookup(file.path) as string
      })
    )
    const link = `https://${bucketName}.s3.amazomaws.com/${newFileName}`
    links.push(link)
  }

  res.json('ok')
}

export const config = {
  api: { bodyParser: false }
}
