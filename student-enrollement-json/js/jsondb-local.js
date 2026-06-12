/*
 * jsondb-local.js
 * Minimal JSONdb-compatible implementation backed by localStorage.
 * Used as a fallback when the CDN bundle is unavailable.
 *
 * API surface used by this project:
 *   jsondb.get(dbName)            → returns db instance
 *   db.collection(name)           → returns collection instance
 *   col.find(query)               → returns array of matching docs
 *   col.findOne(query)            → returns first match or null
 *   col.insert(doc)               → inserts doc, returns doc
 *   col.update(query, changes)    → updates matching docs
 *   col.remove(query)             → removes matching docs
 */

(function (global) {
  'use strict';

  function loadStore(dbName) {
    try {
      return JSON.parse(localStorage.getItem('jsondb__' + dbName) || '{}');
    } catch { return {}; }
  }

  function saveStore(dbName, store) {
    localStorage.setItem('jsondb__' + dbName, JSON.stringify(store));
  }

  function matches(doc, query) {
    return Object.keys(query).every(k => doc[k] === query[k]);
  }

  function Collection(dbName, colName) {
    this._db  = dbName;
    this._col = colName;
  }

  Collection.prototype._docs = function () {
    const store = loadStore(this._db);
    return store[this._col] || [];
  };

  Collection.prototype._save = function (docs) {
    const store = loadStore(this._db);
    store[this._col] = docs;
    saveStore(this._db, store);
  };

  Collection.prototype.find = function (query) {
    const docs = this._docs();
    if (!query || !Object.keys(query).length) return docs.slice();
    return docs.filter(d => matches(d, query));
  };

  Collection.prototype.findOne = function (query) {
    return this.find(query)[0] || null;
  };

  Collection.prototype.insert = function (doc) {
    const docs = this._docs();
    docs.push(doc);
    this._save(docs);
    return doc;
  };

  Collection.prototype.update = function (query, changes) {
    const docs = this._docs().map(d => {
      if (matches(d, query)) return Object.assign({}, d, changes);
      return d;
    });
    this._save(docs);
  };

  Collection.prototype.remove = function (query) {
    const docs = this._docs().filter(d => !matches(d, query));
    this._save(docs);
  };

  function Database(dbName) {
    this._name = dbName;
  }

  Database.prototype.collection = function (name) {
    return new Collection(this._name, name);
  };

  global.jsondb = {
    get: function (dbName) { return new Database(dbName); }
  };

})(window);
