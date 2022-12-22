
import clientPromise from "../../lib/mongodb"

export default async function handler(req, res) {

    const client = await clientPromise

    const db = client.db('mumu_indexer_s2_1')
    const solutions = await db
        .collection('mumu-s2-events')
        .find({
            instructions: {
                $not: { $size: 0 }
            },
            delivered: {
                $gte: 0
            }
        })
        .sort({
            '_chain.valid_from': -1 // prefer latest
        })
        .limit (100) // get 100 most recent solutions
        .toArray()

    res.status(200).json({ 'solutions': solutions })
}
