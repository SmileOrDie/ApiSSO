const { ENVIRONMENT } = require('../../../config')

class DbManager {
    constructor (data, table) {
        this.data = data

        this.keys = { lst: [], str: '' }
        this.values = { lst: [], str: '' }
        for (const key in data){
            this.keys.lst.push(key)
            switch (typeof data[key]) {
                case "bigint":
                case "number":
                    this.values.lst.push(data[key])
                    break
                case "string":
                    this.values.lst.push('\'' + data[key] + '\'')
                    break
                case "object":
                    this.values.lst.push(JSON.stringify(data[key]))
                    break
                default:
                    console.log('DbManager : switch in default case.', {[key]: data[key]})
                    this.values.lst.push(JSON.stringify(data[key]))
                    break

            }
        }
        this.keys.str = this.keys.lst.join(',')
        this.values.str = this.values.lst.join(', ')

        this.tableName = table + ((ENVIRONMENT) ? '_' + ENVIRONMENT  : '')
    }

    getInsertQuery () {
        if (!this.keys.lst.length || !this.values.lst.length || this.keys.lst.length !== this.values.lst.length) {
            throw {
                status: 400,
                func: 'getInsertQuery',
                msg: 'construct Query failed',
                debug: {
                    keys: this.keys,
                    values: this.values
                }
            }
        }
        return `INSERT INTO ${this.tableName}(${this.keys.str})VALUES(${this.values.str})`
    }



    getUpdateQuery (key, val) {
        if (!this.keys.lst.length || !this.values.lst.length || this.keys.lst.length !== this.values.lst.length) {
            throw {
                status: 400,
                func: 'getUpdateQuery',
                msg: 'construct Query failed',
                debug: {
                    keys: this.keys,
                    values: this.values,
                    id: this.data.id
                }
            }
        }
        return `UPDATE ${this.tableName} SET ${key} = '${val}' WHERE id = '${this.data.id}'`
    }

    getDeleteQuery () {
        if (!this.data.id) {
            throw {
                status: 400,
                func: 'deleteItem',
                msg: 'construct Query failed',
                debug: {
                    id: this.data.id,
                }
            }
        }

        return `DELETE FROM ${this.tableName} WHERE id = '${this.data.id}'`
    }

    getByEmailQuery () {
        return `SELECT * FROM ${this.tableName} WHERE email = '${this.data.email}'`
    }

    getByUsernameQuery () {
        return `SELECT * FROM ${this.tableName} WHERE username = '${this.data.username}'`
    }

    getByIdQuery () {
        if (!this.data.id) {
            throw {
                status: 400,
                funct: 'getByIdQuery',
                msg: 'construct Query failed',
                debug: {
                    id: this.data.id,
                }
            }
        }

        return `SELECT * FROM ${this.tableName} WHERE id = '${this.data.id}'`
    }
}

module.exports = DbManager