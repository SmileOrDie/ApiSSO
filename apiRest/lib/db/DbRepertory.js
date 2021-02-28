const { ENV_PG_VARS } = require('../../config')
const { Pool } = require('pg')


class DbRepertory {
    constructor () {
        this.client = new Pool(ENV_PG_VARS)
        this.initialised = false
    }

    async _init () {
        if (!this.initialised) {
            await this.client.connect()
            this.initialised = true
        }
    }

    async request (query) {
        await this._init()
        return new Promise((resolve, reject) => {
            this.client.query(query, (err, res) => {
                // this.client.end()
                // this.initialised = false
                if (err){
                    return reject(err)
                }
                return resolve(res)
            })
        })
    }

    async createItem (item) {
        return await this.request(item.getInsertQuery())
    }

    async updateItem (item, key, value) {
        if (key) {
            return await this.request(item.getUpdateQuery(key, value))
        }

        const promiseLst = []
        for (const [key, value] of Object.entries(item.data)) {
            if (value) {
                promiseLst.push(this.request(item.getUpdateQuery(key, value)))
            }
        }
        await Promise.all(promiseLst)
    }

    async deleteItem (item) {
        return await this.request(item.getDeleteQuery())
    }

    async getByIdItem (item) {
        const data = await this.request(item.getByIdQuery())
        return data.rows[0]
    }

    async getByEmailItem (item) {
        const data = await this.request(item.getByEmailQuery())
        return data.rows[0]
    }

    async getByUsernameItem (item) {
        const data = await this.request(item.getByUsernameQuery())
        return data.rows[0]
    }
}

module.exports = DbRepertory