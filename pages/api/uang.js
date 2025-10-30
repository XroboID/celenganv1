import fs from 'fs'
import path from 'path'

const FILE = path.join(process.cwd(), 'uang.json')

async function readFile() {
  try {
    const raw = await fs.promises.readFile(FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { total: 0 }
  }
}

async function writeFile(obj) {
  await fs.promises.writeFile(FILE, JSON.stringify(obj, null, 2), 'utf-8')
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const data = await readFile()
    return res.status(200).json({ total: data.total || 0 })
  }

  if (req.method === 'POST') {
    const { add } = req.body || {}
    if (typeof add !== 'number') return res.status(400).json({ error: 'Bad request: missing add (number)' })

    const data = await readFile()
    data.total = (data.total || 0) + add

    try {
      await writeFile(data)
      return res.status(200).json({ total: data.total })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Gagal menyimpan data' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end('Method Not Allowed')
}