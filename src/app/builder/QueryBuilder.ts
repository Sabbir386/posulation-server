import { FilterQuery, Query, Aggregate } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T> | Aggregate<T[]>;
  public query: Record<string, unknown>;

  constructor(
    modelQuery: Query<T[], T> | Aggregate<T[]>,
    query: Record<string, unknown>,
  ) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  lookup(
    lookups: {
      from: string;
      localField: string;
      foreignField: string;
      as: string;
    }[],
  ) {
    if (!(this.modelQuery instanceof Aggregate)) {
      this.modelQuery = this.modelQuery.model.aggregate([]);
    }

    lookups.forEach((lookupConfig) => {
      this.modelQuery = (this.modelQuery as Aggregate<T[]>)
        .append({
          $lookup: {
            from: lookupConfig.from,
            localField: lookupConfig.localField,
            foreignField: lookupConfig.foreignField,
            as: lookupConfig.as,
          },
        })
        .append({
          $unwind: `$${lookupConfig.as}`,
        });
    });

    return this;
  }

  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      const searchFilter = {
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      };

      if (this.modelQuery instanceof Query) {
        this.modelQuery = this.modelQuery.find(searchFilter);
      } else if (this.modelQuery instanceof Aggregate) {
        this.modelQuery = this.modelQuery.append({ $match: searchFilter });
      }
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.query }; // copy

    // Filtering
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    console.log('Filtering with query object:', queryObj);

    if (this.modelQuery instanceof Query) {
      this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    } else if (this.modelQuery instanceof Aggregate) {
      this.modelQuery = this.modelQuery.append({ $match: queryObj });
    }
    return this;
  }

  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';
    if (this.modelQuery instanceof Query) {
      this.modelQuery = this.modelQuery.sort(sort as string);
    } else if (this.modelQuery instanceof Aggregate) {
      const sortObj: any = {};
      sort.split(' ').forEach((s: string) => {
        if (s[0] === '-') {
          sortObj[s.substring(1)] = -1;
        } else {
          sortObj[s] = 1;
        }
      });
      this.modelQuery = this.modelQuery.append({ $sort: sortObj });
    }
    return this;
  }
  paginate() {
    if (this?.query?.page && this?.query?.limit) {
      const page = Number(this?.query?.page) || 1;
      const limit = Number(this?.query?.limit) || 10;
      const skip = (page - 1) * limit;
  
      if (this.modelQuery instanceof Query) {
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
      } else if (this.modelQuery instanceof Aggregate) {
        this.modelQuery = this.modelQuery.append(
          { $skip: skip },
          { $limit: limit },
        );
      }
    }
    return this;
  }
  

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

    if (this.modelQuery instanceof Query) {
      this.modelQuery = this.modelQuery.select(fields);
    } else if (this.modelQuery instanceof Aggregate) {
      const projectFields = fields.split(' ').reduce(
        (acc, field) => {
          if (field[0] === '-') {
            acc[field.substring(1)] = 0;
          } else {
            acc[field] = 1;
          }
          return acc;
        },
        {} as Record<string, number>,
      );

      this.modelQuery = this.modelQuery.append({ $project: projectFields });
    }
    return this;
  }

  async countTotal() {
    let total = 0;
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    
    if (this.modelQuery instanceof Query) {
      total = await this.modelQuery.model.countDocuments(this.modelQuery.getFilter());
    } else if (this.modelQuery instanceof Aggregate) {
      const countAggregate = this.modelQuery.append({ $count: 'total' });
      const result = await countAggregate.exec() as { total: number }[];
      total = result.length > 0 ? result[0].total : 0;
    }
    
    const totalPage = Math.ceil(total / limit);
    
    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
  
}

export default QueryBuilder;
