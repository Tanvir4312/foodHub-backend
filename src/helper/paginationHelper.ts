interface PaginationOptions {
  page?: number | string;
  limit?: number | string;
}
interface Options {
  page: number;
  limit: number;
  skip: number;
}

export const paginationHelper = (options: PaginationOptions): Options => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 7;
  const skip = (page - 1) * limit;
  return {
    page,
    limit,
    skip,
  };
};
