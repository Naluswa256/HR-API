import { Document, Schema, Model, PopulateOptions } from 'mongoose';

/**
 * @typedef {Object} QueryResult
 * @property {Document[]} results - Results found
 * @property {number} page - Current page
 * @property {number} limit - Maximum number of results per page
 * @property {number} totalPages - Total number of pages
 * @property {number} totalResults - Total number of documents
 * @property {boolean} hasPrevPage - Availability of previous page
 * @property {boolean} hasNextPage - Availability of next page
 * @property {number | null} prevPage - Previous page number if available or NULL
 * @property {number | null} nextPage - Next page number if available or NULL
 * @property {number} pagingCounter - The starting index/serial/chronological number of the first document in the current page
 */

export interface QueryResult<T> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
  pagingCounter: number;
}

// Type for the options parameter in paginate
export interface PaginateOptions {
  sortBy?: string;
  populate?: string;
  limit?: number;
  page?: number;
}

export interface PaginateModel<T extends Document> extends Model<T> {
  paginate(filter: Record<string, any>, options: PaginateOptions): Promise<QueryResult<T>>;
}

const paginate = <T extends Document>(schema: Schema<T>): void => {
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {PaginateOptions} [options] - Query options
   * @returns {Promise<QueryResult<Document>>}
   */
  schema.statics.paginate = async function (
    filter: Record<string, any> = {},
    options: PaginateOptions = {}
  ): Promise<QueryResult<T>> {
    let sort = '';
    if (options.sortBy) {
      const sortingCriteria: string[] = [];
      options.sortBy.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':');
        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = 'createdAt';
    }

    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const page = options.page && options.page > 0 ? options.page : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

    if (options.populate) {
      options.populate.split(',').forEach((populateOption) => {
        // Create a nested populate object
        const populatePath = populateOption
          .split('.')
          .reverse()
          .reduce((acc, b) => ({ path: b, populate: acc }), {} as PopulateOptions);
        
        docsPromise = docsPromise.populate(populatePath);
      });
    }

    docsPromise = docsPromise.exec();

    const [totalResults, results] = await Promise.all([countPromise, docsPromise]);
    const totalPages = Math.ceil(totalResults / limit);
    
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    
    const result: QueryResult<T> = {
      results,
      page,
      limit,
      totalPages,
      totalResults,
      hasPrevPage,
      hasNextPage,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
      pagingCounter: (page - 1) * limit + 1, // Starting index of the current page
    };

    return result;
  };
};

export default paginate;
