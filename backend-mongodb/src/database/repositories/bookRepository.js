const MongooseRepository = require('./mongooseRepository');
const MongooseQueryUtils = require('../utils/mongooseQueryUtils');
const AuditLogRepository = require('./auditLogRepository');
const Book = require('../models/book');
const Loan = require('../models/loan');

/**
 * Handles database operations for the Book.
 * See https://mongoosejs.com/docs/index.html to learn how to customize it.
 */
class BookRepository {
  /**
   * Creates the Book.
   *
   * @param {Object} data
   * @param {Object} [options]
   */
  async create(data, options) {
    if (MongooseRepository.getSession(options)) {
      await Book.createCollection();
    }

    const currentUser = MongooseRepository.getCurrentUser(
      options,
    );

    const [record] = await Book.create(
      [
        {
          ...data,
          createdBy: currentUser.id,
          updatedBy: currentUser.id,
        },
      ],
      MongooseRepository.getSessionOptionsIfExists(options),
    );

    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record.id,
      data,
      options,
    );



    return this.findById(record.id, options);
  }

  /**
   * Updates the Book.
   *
   * @param {Object} data
   * @param {Object} [options]
   */
  async update(id, data, options) {
    await MongooseRepository.wrapWithSessionIfExists(
      Book.updateOne(
        { _id: id },
        {
          ...data,
          updatedBy: MongooseRepository.getCurrentUser(
            options,
          ).id,
        },
      ),
      options,
    );

    await this._createAuditLog(
      AuditLogRepository.UPDATE,
      id,
      data,
      options,
    );

    const record = await this.findById(id, options);



    return record;
  }

  /**
   * Deletes the Book.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  async destroy(id, options) {
    await MongooseRepository.wrapWithSessionIfExists(
      Book.deleteOne({ _id: id }),
      options,
    );

    await this._createAuditLog(
      AuditLogRepository.DELETE,
      id,
      null,
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      Loan,
      'book',
      options,
    );
  }

  /**
   * Counts the number of Books based on the filter.
   *
   * @param {Object} filter
   * @param {Object} [options]
   */
  async count(filter, options) {
    return MongooseRepository.wrapWithSessionIfExists(
      Book.countDocuments(filter),
      options,
    );
  }

  /**
   * Finds the Book and its relations.
   *
   * @param {string} id
   * @param {Object} [options]
   */
  async findById(id, options) {
    return MongooseRepository.wrapWithSessionIfExists(
      Book.findById(id),
      options,
    );
  }

  /**
   * Finds the Books based on the query.
   * See https://mongoosejs.com/docs/queries.html to learn how
   * to customize the queries.
   *
   * @param {Object} query
   * @param {Object} query.filter
   * @param {number} query.limit
   * @param  {number} query.offset
   * @param  {string} query.orderBy
   *
   * @returns {Promise<Object>} response - Object containing the rows and the count.
   */
  async findAndCountAll(
    { filter, limit, offset, orderBy } = {
      filter: null,
      limit: 0,
      offset: 0,
      orderBy: null,
    },
    options,
  ) {
    let criteria = {};

    if (filter) {
      if (filter.id) {
        criteria = {
          ...criteria,
          ['_id']: MongooseQueryUtils.uuid(filter.id),
        };
      }

      if (filter.isbn) {
        criteria = {
          ...criteria,
          isbn: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.isbn,
            ),
            $options: 'i',
          },
        };
      }

      if (filter.title) {
        criteria = {
          ...criteria,
          title: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.title,
            ),
            $options: 'i',
          },
        };
      }

      if (filter.author) {
        criteria = {
          ...criteria,
          author: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.author,
            ),
            $options: 'i',
          },
        };
      }

      if (filter.stockRange) {
        const [start, end] = filter.stockRange;

        if (start !== undefined && start !== null && start !== '') {
          criteria = {
            ...criteria,
            stock: {
              ...criteria.stock,
              $gte: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          criteria = {
            ...criteria,
            stock: {
              ...criteria.stock,
              $lte: start,
            },
          };
        }
      }

      if (filter.status) {
        criteria = {
          ...criteria,
          status: filter.status
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          criteria = {
            ...criteria,
            ['createdAt']: {
              ...criteria.createdAt,
              $gte: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          criteria = {
            ...criteria,
            ['createdAt']: {
              ...criteria.createdAt,
              $lte: end,
            },
          };
        }
      }
    }

    const sort = MongooseQueryUtils.sort(
      orderBy || 'createdAt_DESC',
    );

    const skip = Number(offset || 0) || undefined;
    const limitEscaped = Number(limit || 0) || undefined;

    const rows = await Book.find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort);

    const count = await Book.countDocuments(criteria);

    return { rows, count };
  }

  /**
   * Lists the Books to populate the autocomplete.
   * See https://mongoosejs.com/docs/queries.html to learn how to
   * customize the query.
   *
   * @param {Object} search
   * @param {number} limit
   */
  async findAllAutocomplete(search, limit) {
    let criteria = {};

    if (search) {
      criteria = {
        $or: [
          { _id: MongooseQueryUtils.uuid(search) },
          {
            title: {
              $regex: MongooseQueryUtils.escapeRegExp(search),
              $options: 'i',
            }
          },
        ],
      };
    }

    const sort = MongooseQueryUtils.sort('title_ASC');
    const limitEscaped = Number(limit || 0) || undefined;

    const records = await Book.find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    return records.map((record) => ({
      id: record.id,
      label: record['title'],
    }));
  }

  /**
   * Creates an audit log of the operation.
   *
   * @param {string} action - The action [create, update or delete].
   * @param {object} id - The record id
   * @param {object} data - The new data passed on the request
   * @param {object} options
   */
  async _createAuditLog(action, id, data, options) {
    await AuditLogRepository.log(
      {
        entityName: Book.modelName,
        entityId: id,
        action,
        values: data,
      },
      options,
    );
  }
}

module.exports = BookRepository;
