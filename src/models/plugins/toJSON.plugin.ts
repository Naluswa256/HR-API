import { Schema } from 'mongoose';

/**
 * A mongoose schema plugin that applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */

// Type for the deleteAtPath function
const deleteAtPath = (obj: Record<string, any>, path: string[], index: number): void => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  deleteAtPath(obj[path[index]], path, index + 1);
};

// Type for the transform function
type TransformFunction = (
  doc: any,
  ret: Record<string, any>,
  options: any
) => Record<string, any> | void;

// Type for the options in toJSON
interface ToJSONOptions {
  transform?: TransformFunction;
}

// Type for the schema in the plugin
interface ToJSONSchema extends Schema {
  options: {
    toJSON?: ToJSONOptions;
  };
}

const toJSON = (schema: ToJSONSchema): void => {
  let transform: TransformFunction | undefined;
  
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    transform = schema.options.toJSON.transform;
  }

  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(doc: any, ret: Record<string, any>, options: any): Record<string, any> | void {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          deleteAtPath(ret, path.split('.'), 0);
        }
      });

      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      delete ret.systemAndAccessInfo.passwordHash;

      if (transform) {
        return transform(doc, ret, options);
      }
    },
  });
};

export default toJSON;
