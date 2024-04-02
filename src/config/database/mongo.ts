export const mongoConfig = () => {
  return `mongodb://${process.env.MONGODB_DATABASE_USER}:${
    process.env.MONGODB_DATABASE_PASSWORD
  }@${process.env.MONGODB_DATABASE_HOST}:${
    process.env.MONGODB_DATABASE_PORT || 27017
  }/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1`;
};
