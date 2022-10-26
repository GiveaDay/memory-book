import {convertAllDatesToDateObjects, isArray, isSet} from "./data.mjs";
import {toCamelCase} from "./text.mjs";

export class ConnectionWrapper {
  constructor(connection) {
    this._connection = connection
  }

  async query(sql, params) {
    params = this._convertParams(params)
    let result = await this._connection.all(sql, convertAllDatesToDateObjects(params))
    if (isArray(result)) {
      return this._mapResults(result)
    } else {
      return result
    }
  }

  async batch(sql, params) {
    params = this._convertParams(params)
    if (params.length === 0) {
      return // Nothing to do
    }
    return await this._connection.batch(sql, params)
  }

  async querySingle(sql, params) {
    params = this._convertParams(params)
    let rows = await this.query(sql, convertAllDatesToDateObjects(params))
    if (rows.length === 0) {
      return null
    }
    if (rows.length > 1) {
      throw new Error(`Query returned ${rows.length} results ${sql}`)
    }
    return rows[0]
  }

  async querySingleField(sql, params) {
    let row = await this.querySingle(sql, params)
    if (!isSet(row)) {
      return null
    } else {
      return this._extractFieldFromRow(row)
    }
  }

  _extractFieldFromRow(row) {
    let keys = Object.keys(row)
    if (keys.length !== 1) {
      throw new Error(`Expected SQL result with 1 field, got multiple fields: ${JSON.stringify(keys)}`)
    }
    return row[keys[0]]
  }

  async queryField(sql, params) {
    let rows = await this.query(sql, params)
    return rows.map(row => this._extractFieldFromRow(row))
  }

  /**
   * Rewrite the rows, so that
   * - the names of database columns with underscores (e.g. background_color) are converted to camelcase (e.g. backgroundColor)
   * - sql dates are converted to javascript Date objects
   */
  _mapResults(rows) {
    return rows.map(row => {
      let mappedRow = {}
      for (let [key, value] of Object.entries(row)) {
        if (key.indexOf('_') >= 0) {
          key = this._rewriteKey(key)
        }
        mappedRow[key] = value
      }
      return mappedRow
    })
  }

  _rewriteKey(key) {
    return toCamelCase(key)
  }

  _convertParams(params) {
    if (isArray(params)) {
      return params.map(param => {
        if (param === undefined) {
          return null
        } else if (isArray(param)) {
          if (param.length === 0) {
            return ['DUMMY_ELEMENT_IN_EMPTY_LIST'] // This ensures we can run SQL queries such as ' id in ?' and pass an empty list to this without crashing
          } else {
            return this._convertParams(param)
          }
        } else {
          return param
        }
      })
    } else {
      return params
    }
  }
}
