
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model diesel_schema_migrations
 * 
 */
export type diesel_schema_migrations = $Result.DefaultSelection<Prisma.$diesel_schema_migrationsPayload>
/**
 * Model activegames
 * 
 */
export type activegames = $Result.DefaultSelection<Prisma.$activegamesPayload>
/**
 * Model gamehistory
 * 
 */
export type gamehistory = $Result.DefaultSelection<Prisma.$gamehistoryPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Diesel_schema_migrations
 * const diesel_schema_migrations = await prisma.diesel_schema_migrations.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Diesel_schema_migrations
   * const diesel_schema_migrations = await prisma.diesel_schema_migrations.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.diesel_schema_migrations`: Exposes CRUD operations for the **diesel_schema_migrations** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Diesel_schema_migrations
    * const diesel_schema_migrations = await prisma.diesel_schema_migrations.findMany()
    * ```
    */
  get diesel_schema_migrations(): Prisma.diesel_schema_migrationsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.activegames`: Exposes CRUD operations for the **activegames** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Activegames
    * const activegames = await prisma.activegames.findMany()
    * ```
    */
  get activegames(): Prisma.activegamesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gamehistory`: Exposes CRUD operations for the **gamehistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Gamehistories
    * const gamehistories = await prisma.gamehistory.findMany()
    * ```
    */
  get gamehistory(): Prisma.gamehistoryDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    diesel_schema_migrations: 'diesel_schema_migrations',
    activegames: 'activegames',
    gamehistory: 'gamehistory'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "diesel_schema_migrations" | "activegames" | "gamehistory"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      diesel_schema_migrations: {
        payload: Prisma.$diesel_schema_migrationsPayload<ExtArgs>
        fields: Prisma.diesel_schema_migrationsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.diesel_schema_migrationsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$diesel_schema_migrationsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.diesel_schema_migrationsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$diesel_schema_migrationsPayload>
          }
          findFirst: {
            args: Prisma.diesel_schema_migrationsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$diesel_schema_migrationsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.diesel_schema_migrationsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$diesel_schema_migrationsPayload>
          }
          findMany: {
            args: Prisma.diesel_schema_migrationsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$diesel_schema_migrationsPayload>[]
          }
          create: {
            args: Prisma.diesel_schema_migrationsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$diesel_schema_migrationsPayload>
          }
          createMany: {
            args: Prisma.diesel_schema_migrationsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.diesel_schema_migrationsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$diesel_schema_migrationsPayload>[]
          }
          delete: {
            args: Prisma.diesel_schema_migrationsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$diesel_schema_migrationsPayload>
          }
          update: {
            args: Prisma.diesel_schema_migrationsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$diesel_schema_migrationsPayload>
          }
          deleteMany: {
            args: Prisma.diesel_schema_migrationsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.diesel_schema_migrationsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.diesel_schema_migrationsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$diesel_schema_migrationsPayload>[]
          }
          upsert: {
            args: Prisma.diesel_schema_migrationsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$diesel_schema_migrationsPayload>
          }
          aggregate: {
            args: Prisma.Diesel_schema_migrationsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDiesel_schema_migrations>
          }
          groupBy: {
            args: Prisma.diesel_schema_migrationsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Diesel_schema_migrationsGroupByOutputType>[]
          }
          count: {
            args: Prisma.diesel_schema_migrationsCountArgs<ExtArgs>
            result: $Utils.Optional<Diesel_schema_migrationsCountAggregateOutputType> | number
          }
        }
      }
      activegames: {
        payload: Prisma.$activegamesPayload<ExtArgs>
        fields: Prisma.activegamesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.activegamesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$activegamesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.activegamesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$activegamesPayload>
          }
          findFirst: {
            args: Prisma.activegamesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$activegamesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.activegamesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$activegamesPayload>
          }
          findMany: {
            args: Prisma.activegamesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$activegamesPayload>[]
          }
          create: {
            args: Prisma.activegamesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$activegamesPayload>
          }
          createMany: {
            args: Prisma.activegamesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.activegamesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$activegamesPayload>[]
          }
          delete: {
            args: Prisma.activegamesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$activegamesPayload>
          }
          update: {
            args: Prisma.activegamesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$activegamesPayload>
          }
          deleteMany: {
            args: Prisma.activegamesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.activegamesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.activegamesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$activegamesPayload>[]
          }
          upsert: {
            args: Prisma.activegamesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$activegamesPayload>
          }
          aggregate: {
            args: Prisma.ActivegamesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateActivegames>
          }
          groupBy: {
            args: Prisma.activegamesGroupByArgs<ExtArgs>
            result: $Utils.Optional<ActivegamesGroupByOutputType>[]
          }
          count: {
            args: Prisma.activegamesCountArgs<ExtArgs>
            result: $Utils.Optional<ActivegamesCountAggregateOutputType> | number
          }
        }
      }
      gamehistory: {
        payload: Prisma.$gamehistoryPayload<ExtArgs>
        fields: Prisma.gamehistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.gamehistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$gamehistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.gamehistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$gamehistoryPayload>
          }
          findFirst: {
            args: Prisma.gamehistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$gamehistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.gamehistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$gamehistoryPayload>
          }
          findMany: {
            args: Prisma.gamehistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$gamehistoryPayload>[]
          }
          create: {
            args: Prisma.gamehistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$gamehistoryPayload>
          }
          createMany: {
            args: Prisma.gamehistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.gamehistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$gamehistoryPayload>[]
          }
          delete: {
            args: Prisma.gamehistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$gamehistoryPayload>
          }
          update: {
            args: Prisma.gamehistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$gamehistoryPayload>
          }
          deleteMany: {
            args: Prisma.gamehistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.gamehistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.gamehistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$gamehistoryPayload>[]
          }
          upsert: {
            args: Prisma.gamehistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$gamehistoryPayload>
          }
          aggregate: {
            args: Prisma.GamehistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGamehistory>
          }
          groupBy: {
            args: Prisma.gamehistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<GamehistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.gamehistoryCountArgs<ExtArgs>
            result: $Utils.Optional<GamehistoryCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    diesel_schema_migrations?: diesel_schema_migrationsOmit
    activegames?: activegamesOmit
    gamehistory?: gamehistoryOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model diesel_schema_migrations
   */

  export type AggregateDiesel_schema_migrations = {
    _count: Diesel_schema_migrationsCountAggregateOutputType | null
    _min: Diesel_schema_migrationsMinAggregateOutputType | null
    _max: Diesel_schema_migrationsMaxAggregateOutputType | null
  }

  export type Diesel_schema_migrationsMinAggregateOutputType = {
    version: string | null
    run_on: Date | null
  }

  export type Diesel_schema_migrationsMaxAggregateOutputType = {
    version: string | null
    run_on: Date | null
  }

  export type Diesel_schema_migrationsCountAggregateOutputType = {
    version: number
    run_on: number
    _all: number
  }


  export type Diesel_schema_migrationsMinAggregateInputType = {
    version?: true
    run_on?: true
  }

  export type Diesel_schema_migrationsMaxAggregateInputType = {
    version?: true
    run_on?: true
  }

  export type Diesel_schema_migrationsCountAggregateInputType = {
    version?: true
    run_on?: true
    _all?: true
  }

  export type Diesel_schema_migrationsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which diesel_schema_migrations to aggregate.
     */
    where?: diesel_schema_migrationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of diesel_schema_migrations to fetch.
     */
    orderBy?: diesel_schema_migrationsOrderByWithRelationInput | diesel_schema_migrationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: diesel_schema_migrationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` diesel_schema_migrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` diesel_schema_migrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned diesel_schema_migrations
    **/
    _count?: true | Diesel_schema_migrationsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Diesel_schema_migrationsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Diesel_schema_migrationsMaxAggregateInputType
  }

  export type GetDiesel_schema_migrationsAggregateType<T extends Diesel_schema_migrationsAggregateArgs> = {
        [P in keyof T & keyof AggregateDiesel_schema_migrations]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDiesel_schema_migrations[P]>
      : GetScalarType<T[P], AggregateDiesel_schema_migrations[P]>
  }




  export type diesel_schema_migrationsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: diesel_schema_migrationsWhereInput
    orderBy?: diesel_schema_migrationsOrderByWithAggregationInput | diesel_schema_migrationsOrderByWithAggregationInput[]
    by: Diesel_schema_migrationsScalarFieldEnum[] | Diesel_schema_migrationsScalarFieldEnum
    having?: diesel_schema_migrationsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Diesel_schema_migrationsCountAggregateInputType | true
    _min?: Diesel_schema_migrationsMinAggregateInputType
    _max?: Diesel_schema_migrationsMaxAggregateInputType
  }

  export type Diesel_schema_migrationsGroupByOutputType = {
    version: string
    run_on: Date
    _count: Diesel_schema_migrationsCountAggregateOutputType | null
    _min: Diesel_schema_migrationsMinAggregateOutputType | null
    _max: Diesel_schema_migrationsMaxAggregateOutputType | null
  }

  type GetDiesel_schema_migrationsGroupByPayload<T extends diesel_schema_migrationsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Diesel_schema_migrationsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Diesel_schema_migrationsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Diesel_schema_migrationsGroupByOutputType[P]>
            : GetScalarType<T[P], Diesel_schema_migrationsGroupByOutputType[P]>
        }
      >
    >


  export type diesel_schema_migrationsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    version?: boolean
    run_on?: boolean
  }, ExtArgs["result"]["diesel_schema_migrations"]>

  export type diesel_schema_migrationsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    version?: boolean
    run_on?: boolean
  }, ExtArgs["result"]["diesel_schema_migrations"]>

  export type diesel_schema_migrationsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    version?: boolean
    run_on?: boolean
  }, ExtArgs["result"]["diesel_schema_migrations"]>

  export type diesel_schema_migrationsSelectScalar = {
    version?: boolean
    run_on?: boolean
  }

  export type diesel_schema_migrationsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"version" | "run_on", ExtArgs["result"]["diesel_schema_migrations"]>

  export type $diesel_schema_migrationsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "diesel_schema_migrations"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      version: string
      run_on: Date
    }, ExtArgs["result"]["diesel_schema_migrations"]>
    composites: {}
  }

  type diesel_schema_migrationsGetPayload<S extends boolean | null | undefined | diesel_schema_migrationsDefaultArgs> = $Result.GetResult<Prisma.$diesel_schema_migrationsPayload, S>

  type diesel_schema_migrationsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<diesel_schema_migrationsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Diesel_schema_migrationsCountAggregateInputType | true
    }

  export interface diesel_schema_migrationsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['diesel_schema_migrations'], meta: { name: 'diesel_schema_migrations' } }
    /**
     * Find zero or one Diesel_schema_migrations that matches the filter.
     * @param {diesel_schema_migrationsFindUniqueArgs} args - Arguments to find a Diesel_schema_migrations
     * @example
     * // Get one Diesel_schema_migrations
     * const diesel_schema_migrations = await prisma.diesel_schema_migrations.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends diesel_schema_migrationsFindUniqueArgs>(args: SelectSubset<T, diesel_schema_migrationsFindUniqueArgs<ExtArgs>>): Prisma__diesel_schema_migrationsClient<$Result.GetResult<Prisma.$diesel_schema_migrationsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Diesel_schema_migrations that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {diesel_schema_migrationsFindUniqueOrThrowArgs} args - Arguments to find a Diesel_schema_migrations
     * @example
     * // Get one Diesel_schema_migrations
     * const diesel_schema_migrations = await prisma.diesel_schema_migrations.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends diesel_schema_migrationsFindUniqueOrThrowArgs>(args: SelectSubset<T, diesel_schema_migrationsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__diesel_schema_migrationsClient<$Result.GetResult<Prisma.$diesel_schema_migrationsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Diesel_schema_migrations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {diesel_schema_migrationsFindFirstArgs} args - Arguments to find a Diesel_schema_migrations
     * @example
     * // Get one Diesel_schema_migrations
     * const diesel_schema_migrations = await prisma.diesel_schema_migrations.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends diesel_schema_migrationsFindFirstArgs>(args?: SelectSubset<T, diesel_schema_migrationsFindFirstArgs<ExtArgs>>): Prisma__diesel_schema_migrationsClient<$Result.GetResult<Prisma.$diesel_schema_migrationsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Diesel_schema_migrations that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {diesel_schema_migrationsFindFirstOrThrowArgs} args - Arguments to find a Diesel_schema_migrations
     * @example
     * // Get one Diesel_schema_migrations
     * const diesel_schema_migrations = await prisma.diesel_schema_migrations.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends diesel_schema_migrationsFindFirstOrThrowArgs>(args?: SelectSubset<T, diesel_schema_migrationsFindFirstOrThrowArgs<ExtArgs>>): Prisma__diesel_schema_migrationsClient<$Result.GetResult<Prisma.$diesel_schema_migrationsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Diesel_schema_migrations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {diesel_schema_migrationsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Diesel_schema_migrations
     * const diesel_schema_migrations = await prisma.diesel_schema_migrations.findMany()
     * 
     * // Get first 10 Diesel_schema_migrations
     * const diesel_schema_migrations = await prisma.diesel_schema_migrations.findMany({ take: 10 })
     * 
     * // Only select the `version`
     * const diesel_schema_migrationsWithVersionOnly = await prisma.diesel_schema_migrations.findMany({ select: { version: true } })
     * 
     */
    findMany<T extends diesel_schema_migrationsFindManyArgs>(args?: SelectSubset<T, diesel_schema_migrationsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$diesel_schema_migrationsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Diesel_schema_migrations.
     * @param {diesel_schema_migrationsCreateArgs} args - Arguments to create a Diesel_schema_migrations.
     * @example
     * // Create one Diesel_schema_migrations
     * const Diesel_schema_migrations = await prisma.diesel_schema_migrations.create({
     *   data: {
     *     // ... data to create a Diesel_schema_migrations
     *   }
     * })
     * 
     */
    create<T extends diesel_schema_migrationsCreateArgs>(args: SelectSubset<T, diesel_schema_migrationsCreateArgs<ExtArgs>>): Prisma__diesel_schema_migrationsClient<$Result.GetResult<Prisma.$diesel_schema_migrationsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Diesel_schema_migrations.
     * @param {diesel_schema_migrationsCreateManyArgs} args - Arguments to create many Diesel_schema_migrations.
     * @example
     * // Create many Diesel_schema_migrations
     * const diesel_schema_migrations = await prisma.diesel_schema_migrations.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends diesel_schema_migrationsCreateManyArgs>(args?: SelectSubset<T, diesel_schema_migrationsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Diesel_schema_migrations and returns the data saved in the database.
     * @param {diesel_schema_migrationsCreateManyAndReturnArgs} args - Arguments to create many Diesel_schema_migrations.
     * @example
     * // Create many Diesel_schema_migrations
     * const diesel_schema_migrations = await prisma.diesel_schema_migrations.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Diesel_schema_migrations and only return the `version`
     * const diesel_schema_migrationsWithVersionOnly = await prisma.diesel_schema_migrations.createManyAndReturn({
     *   select: { version: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends diesel_schema_migrationsCreateManyAndReturnArgs>(args?: SelectSubset<T, diesel_schema_migrationsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$diesel_schema_migrationsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Diesel_schema_migrations.
     * @param {diesel_schema_migrationsDeleteArgs} args - Arguments to delete one Diesel_schema_migrations.
     * @example
     * // Delete one Diesel_schema_migrations
     * const Diesel_schema_migrations = await prisma.diesel_schema_migrations.delete({
     *   where: {
     *     // ... filter to delete one Diesel_schema_migrations
     *   }
     * })
     * 
     */
    delete<T extends diesel_schema_migrationsDeleteArgs>(args: SelectSubset<T, diesel_schema_migrationsDeleteArgs<ExtArgs>>): Prisma__diesel_schema_migrationsClient<$Result.GetResult<Prisma.$diesel_schema_migrationsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Diesel_schema_migrations.
     * @param {diesel_schema_migrationsUpdateArgs} args - Arguments to update one Diesel_schema_migrations.
     * @example
     * // Update one Diesel_schema_migrations
     * const diesel_schema_migrations = await prisma.diesel_schema_migrations.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends diesel_schema_migrationsUpdateArgs>(args: SelectSubset<T, diesel_schema_migrationsUpdateArgs<ExtArgs>>): Prisma__diesel_schema_migrationsClient<$Result.GetResult<Prisma.$diesel_schema_migrationsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Diesel_schema_migrations.
     * @param {diesel_schema_migrationsDeleteManyArgs} args - Arguments to filter Diesel_schema_migrations to delete.
     * @example
     * // Delete a few Diesel_schema_migrations
     * const { count } = await prisma.diesel_schema_migrations.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends diesel_schema_migrationsDeleteManyArgs>(args?: SelectSubset<T, diesel_schema_migrationsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Diesel_schema_migrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {diesel_schema_migrationsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Diesel_schema_migrations
     * const diesel_schema_migrations = await prisma.diesel_schema_migrations.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends diesel_schema_migrationsUpdateManyArgs>(args: SelectSubset<T, diesel_schema_migrationsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Diesel_schema_migrations and returns the data updated in the database.
     * @param {diesel_schema_migrationsUpdateManyAndReturnArgs} args - Arguments to update many Diesel_schema_migrations.
     * @example
     * // Update many Diesel_schema_migrations
     * const diesel_schema_migrations = await prisma.diesel_schema_migrations.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Diesel_schema_migrations and only return the `version`
     * const diesel_schema_migrationsWithVersionOnly = await prisma.diesel_schema_migrations.updateManyAndReturn({
     *   select: { version: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends diesel_schema_migrationsUpdateManyAndReturnArgs>(args: SelectSubset<T, diesel_schema_migrationsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$diesel_schema_migrationsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Diesel_schema_migrations.
     * @param {diesel_schema_migrationsUpsertArgs} args - Arguments to update or create a Diesel_schema_migrations.
     * @example
     * // Update or create a Diesel_schema_migrations
     * const diesel_schema_migrations = await prisma.diesel_schema_migrations.upsert({
     *   create: {
     *     // ... data to create a Diesel_schema_migrations
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Diesel_schema_migrations we want to update
     *   }
     * })
     */
    upsert<T extends diesel_schema_migrationsUpsertArgs>(args: SelectSubset<T, diesel_schema_migrationsUpsertArgs<ExtArgs>>): Prisma__diesel_schema_migrationsClient<$Result.GetResult<Prisma.$diesel_schema_migrationsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Diesel_schema_migrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {diesel_schema_migrationsCountArgs} args - Arguments to filter Diesel_schema_migrations to count.
     * @example
     * // Count the number of Diesel_schema_migrations
     * const count = await prisma.diesel_schema_migrations.count({
     *   where: {
     *     // ... the filter for the Diesel_schema_migrations we want to count
     *   }
     * })
    **/
    count<T extends diesel_schema_migrationsCountArgs>(
      args?: Subset<T, diesel_schema_migrationsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Diesel_schema_migrationsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Diesel_schema_migrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Diesel_schema_migrationsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Diesel_schema_migrationsAggregateArgs>(args: Subset<T, Diesel_schema_migrationsAggregateArgs>): Prisma.PrismaPromise<GetDiesel_schema_migrationsAggregateType<T>>

    /**
     * Group by Diesel_schema_migrations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {diesel_schema_migrationsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends diesel_schema_migrationsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: diesel_schema_migrationsGroupByArgs['orderBy'] }
        : { orderBy?: diesel_schema_migrationsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, diesel_schema_migrationsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDiesel_schema_migrationsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the diesel_schema_migrations model
   */
  readonly fields: diesel_schema_migrationsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for diesel_schema_migrations.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__diesel_schema_migrationsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the diesel_schema_migrations model
   */
  interface diesel_schema_migrationsFieldRefs {
    readonly version: FieldRef<"diesel_schema_migrations", 'String'>
    readonly run_on: FieldRef<"diesel_schema_migrations", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * diesel_schema_migrations findUnique
   */
  export type diesel_schema_migrationsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diesel_schema_migrations
     */
    select?: diesel_schema_migrationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the diesel_schema_migrations
     */
    omit?: diesel_schema_migrationsOmit<ExtArgs> | null
    /**
     * Filter, which diesel_schema_migrations to fetch.
     */
    where: diesel_schema_migrationsWhereUniqueInput
  }

  /**
   * diesel_schema_migrations findUniqueOrThrow
   */
  export type diesel_schema_migrationsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diesel_schema_migrations
     */
    select?: diesel_schema_migrationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the diesel_schema_migrations
     */
    omit?: diesel_schema_migrationsOmit<ExtArgs> | null
    /**
     * Filter, which diesel_schema_migrations to fetch.
     */
    where: diesel_schema_migrationsWhereUniqueInput
  }

  /**
   * diesel_schema_migrations findFirst
   */
  export type diesel_schema_migrationsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diesel_schema_migrations
     */
    select?: diesel_schema_migrationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the diesel_schema_migrations
     */
    omit?: diesel_schema_migrationsOmit<ExtArgs> | null
    /**
     * Filter, which diesel_schema_migrations to fetch.
     */
    where?: diesel_schema_migrationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of diesel_schema_migrations to fetch.
     */
    orderBy?: diesel_schema_migrationsOrderByWithRelationInput | diesel_schema_migrationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for diesel_schema_migrations.
     */
    cursor?: diesel_schema_migrationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` diesel_schema_migrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` diesel_schema_migrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of diesel_schema_migrations.
     */
    distinct?: Diesel_schema_migrationsScalarFieldEnum | Diesel_schema_migrationsScalarFieldEnum[]
  }

  /**
   * diesel_schema_migrations findFirstOrThrow
   */
  export type diesel_schema_migrationsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diesel_schema_migrations
     */
    select?: diesel_schema_migrationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the diesel_schema_migrations
     */
    omit?: diesel_schema_migrationsOmit<ExtArgs> | null
    /**
     * Filter, which diesel_schema_migrations to fetch.
     */
    where?: diesel_schema_migrationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of diesel_schema_migrations to fetch.
     */
    orderBy?: diesel_schema_migrationsOrderByWithRelationInput | diesel_schema_migrationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for diesel_schema_migrations.
     */
    cursor?: diesel_schema_migrationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` diesel_schema_migrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` diesel_schema_migrations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of diesel_schema_migrations.
     */
    distinct?: Diesel_schema_migrationsScalarFieldEnum | Diesel_schema_migrationsScalarFieldEnum[]
  }

  /**
   * diesel_schema_migrations findMany
   */
  export type diesel_schema_migrationsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diesel_schema_migrations
     */
    select?: diesel_schema_migrationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the diesel_schema_migrations
     */
    omit?: diesel_schema_migrationsOmit<ExtArgs> | null
    /**
     * Filter, which diesel_schema_migrations to fetch.
     */
    where?: diesel_schema_migrationsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of diesel_schema_migrations to fetch.
     */
    orderBy?: diesel_schema_migrationsOrderByWithRelationInput | diesel_schema_migrationsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing diesel_schema_migrations.
     */
    cursor?: diesel_schema_migrationsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` diesel_schema_migrations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` diesel_schema_migrations.
     */
    skip?: number
    distinct?: Diesel_schema_migrationsScalarFieldEnum | Diesel_schema_migrationsScalarFieldEnum[]
  }

  /**
   * diesel_schema_migrations create
   */
  export type diesel_schema_migrationsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diesel_schema_migrations
     */
    select?: diesel_schema_migrationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the diesel_schema_migrations
     */
    omit?: diesel_schema_migrationsOmit<ExtArgs> | null
    /**
     * The data needed to create a diesel_schema_migrations.
     */
    data: XOR<diesel_schema_migrationsCreateInput, diesel_schema_migrationsUncheckedCreateInput>
  }

  /**
   * diesel_schema_migrations createMany
   */
  export type diesel_schema_migrationsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many diesel_schema_migrations.
     */
    data: diesel_schema_migrationsCreateManyInput | diesel_schema_migrationsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * diesel_schema_migrations createManyAndReturn
   */
  export type diesel_schema_migrationsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diesel_schema_migrations
     */
    select?: diesel_schema_migrationsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the diesel_schema_migrations
     */
    omit?: diesel_schema_migrationsOmit<ExtArgs> | null
    /**
     * The data used to create many diesel_schema_migrations.
     */
    data: diesel_schema_migrationsCreateManyInput | diesel_schema_migrationsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * diesel_schema_migrations update
   */
  export type diesel_schema_migrationsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diesel_schema_migrations
     */
    select?: diesel_schema_migrationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the diesel_schema_migrations
     */
    omit?: diesel_schema_migrationsOmit<ExtArgs> | null
    /**
     * The data needed to update a diesel_schema_migrations.
     */
    data: XOR<diesel_schema_migrationsUpdateInput, diesel_schema_migrationsUncheckedUpdateInput>
    /**
     * Choose, which diesel_schema_migrations to update.
     */
    where: diesel_schema_migrationsWhereUniqueInput
  }

  /**
   * diesel_schema_migrations updateMany
   */
  export type diesel_schema_migrationsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update diesel_schema_migrations.
     */
    data: XOR<diesel_schema_migrationsUpdateManyMutationInput, diesel_schema_migrationsUncheckedUpdateManyInput>
    /**
     * Filter which diesel_schema_migrations to update
     */
    where?: diesel_schema_migrationsWhereInput
    /**
     * Limit how many diesel_schema_migrations to update.
     */
    limit?: number
  }

  /**
   * diesel_schema_migrations updateManyAndReturn
   */
  export type diesel_schema_migrationsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diesel_schema_migrations
     */
    select?: diesel_schema_migrationsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the diesel_schema_migrations
     */
    omit?: diesel_schema_migrationsOmit<ExtArgs> | null
    /**
     * The data used to update diesel_schema_migrations.
     */
    data: XOR<diesel_schema_migrationsUpdateManyMutationInput, diesel_schema_migrationsUncheckedUpdateManyInput>
    /**
     * Filter which diesel_schema_migrations to update
     */
    where?: diesel_schema_migrationsWhereInput
    /**
     * Limit how many diesel_schema_migrations to update.
     */
    limit?: number
  }

  /**
   * diesel_schema_migrations upsert
   */
  export type diesel_schema_migrationsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diesel_schema_migrations
     */
    select?: diesel_schema_migrationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the diesel_schema_migrations
     */
    omit?: diesel_schema_migrationsOmit<ExtArgs> | null
    /**
     * The filter to search for the diesel_schema_migrations to update in case it exists.
     */
    where: diesel_schema_migrationsWhereUniqueInput
    /**
     * In case the diesel_schema_migrations found by the `where` argument doesn't exist, create a new diesel_schema_migrations with this data.
     */
    create: XOR<diesel_schema_migrationsCreateInput, diesel_schema_migrationsUncheckedCreateInput>
    /**
     * In case the diesel_schema_migrations was found with the provided `where` argument, update it with this data.
     */
    update: XOR<diesel_schema_migrationsUpdateInput, diesel_schema_migrationsUncheckedUpdateInput>
  }

  /**
   * diesel_schema_migrations delete
   */
  export type diesel_schema_migrationsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diesel_schema_migrations
     */
    select?: diesel_schema_migrationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the diesel_schema_migrations
     */
    omit?: diesel_schema_migrationsOmit<ExtArgs> | null
    /**
     * Filter which diesel_schema_migrations to delete.
     */
    where: diesel_schema_migrationsWhereUniqueInput
  }

  /**
   * diesel_schema_migrations deleteMany
   */
  export type diesel_schema_migrationsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which diesel_schema_migrations to delete
     */
    where?: diesel_schema_migrationsWhereInput
    /**
     * Limit how many diesel_schema_migrations to delete.
     */
    limit?: number
  }

  /**
   * diesel_schema_migrations without action
   */
  export type diesel_schema_migrationsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the diesel_schema_migrations
     */
    select?: diesel_schema_migrationsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the diesel_schema_migrations
     */
    omit?: diesel_schema_migrationsOmit<ExtArgs> | null
  }


  /**
   * Model activegames
   */

  export type AggregateActivegames = {
    _count: ActivegamesCountAggregateOutputType | null
    _min: ActivegamesMinAggregateOutputType | null
    _max: ActivegamesMaxAggregateOutputType | null
  }

  export type ActivegamesMinAggregateOutputType = {
    gameid: string | null
    black: string | null
    white: string | null
    createdat: Date | null
  }

  export type ActivegamesMaxAggregateOutputType = {
    gameid: string | null
    black: string | null
    white: string | null
    createdat: Date | null
  }

  export type ActivegamesCountAggregateOutputType = {
    gameid: number
    black: number
    white: number
    createdat: number
    _all: number
  }


  export type ActivegamesMinAggregateInputType = {
    gameid?: true
    black?: true
    white?: true
    createdat?: true
  }

  export type ActivegamesMaxAggregateInputType = {
    gameid?: true
    black?: true
    white?: true
    createdat?: true
  }

  export type ActivegamesCountAggregateInputType = {
    gameid?: true
    black?: true
    white?: true
    createdat?: true
    _all?: true
  }

  export type ActivegamesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which activegames to aggregate.
     */
    where?: activegamesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of activegames to fetch.
     */
    orderBy?: activegamesOrderByWithRelationInput | activegamesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: activegamesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` activegames from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` activegames.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned activegames
    **/
    _count?: true | ActivegamesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ActivegamesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ActivegamesMaxAggregateInputType
  }

  export type GetActivegamesAggregateType<T extends ActivegamesAggregateArgs> = {
        [P in keyof T & keyof AggregateActivegames]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateActivegames[P]>
      : GetScalarType<T[P], AggregateActivegames[P]>
  }




  export type activegamesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: activegamesWhereInput
    orderBy?: activegamesOrderByWithAggregationInput | activegamesOrderByWithAggregationInput[]
    by: ActivegamesScalarFieldEnum[] | ActivegamesScalarFieldEnum
    having?: activegamesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ActivegamesCountAggregateInputType | true
    _min?: ActivegamesMinAggregateInputType
    _max?: ActivegamesMaxAggregateInputType
  }

  export type ActivegamesGroupByOutputType = {
    gameid: string
    black: string
    white: string
    createdat: Date | null
    _count: ActivegamesCountAggregateOutputType | null
    _min: ActivegamesMinAggregateOutputType | null
    _max: ActivegamesMaxAggregateOutputType | null
  }

  type GetActivegamesGroupByPayload<T extends activegamesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ActivegamesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ActivegamesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ActivegamesGroupByOutputType[P]>
            : GetScalarType<T[P], ActivegamesGroupByOutputType[P]>
        }
      >
    >


  export type activegamesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    gameid?: boolean
    black?: boolean
    white?: boolean
    createdat?: boolean
  }, ExtArgs["result"]["activegames"]>

  export type activegamesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    gameid?: boolean
    black?: boolean
    white?: boolean
    createdat?: boolean
  }, ExtArgs["result"]["activegames"]>

  export type activegamesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    gameid?: boolean
    black?: boolean
    white?: boolean
    createdat?: boolean
  }, ExtArgs["result"]["activegames"]>

  export type activegamesSelectScalar = {
    gameid?: boolean
    black?: boolean
    white?: boolean
    createdat?: boolean
  }

  export type activegamesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"gameid" | "black" | "white" | "createdat", ExtArgs["result"]["activegames"]>

  export type $activegamesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "activegames"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      gameid: string
      black: string
      white: string
      createdat: Date | null
    }, ExtArgs["result"]["activegames"]>
    composites: {}
  }

  type activegamesGetPayload<S extends boolean | null | undefined | activegamesDefaultArgs> = $Result.GetResult<Prisma.$activegamesPayload, S>

  type activegamesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<activegamesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ActivegamesCountAggregateInputType | true
    }

  export interface activegamesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['activegames'], meta: { name: 'activegames' } }
    /**
     * Find zero or one Activegames that matches the filter.
     * @param {activegamesFindUniqueArgs} args - Arguments to find a Activegames
     * @example
     * // Get one Activegames
     * const activegames = await prisma.activegames.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends activegamesFindUniqueArgs>(args: SelectSubset<T, activegamesFindUniqueArgs<ExtArgs>>): Prisma__activegamesClient<$Result.GetResult<Prisma.$activegamesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Activegames that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {activegamesFindUniqueOrThrowArgs} args - Arguments to find a Activegames
     * @example
     * // Get one Activegames
     * const activegames = await prisma.activegames.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends activegamesFindUniqueOrThrowArgs>(args: SelectSubset<T, activegamesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__activegamesClient<$Result.GetResult<Prisma.$activegamesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Activegames that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {activegamesFindFirstArgs} args - Arguments to find a Activegames
     * @example
     * // Get one Activegames
     * const activegames = await prisma.activegames.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends activegamesFindFirstArgs>(args?: SelectSubset<T, activegamesFindFirstArgs<ExtArgs>>): Prisma__activegamesClient<$Result.GetResult<Prisma.$activegamesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Activegames that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {activegamesFindFirstOrThrowArgs} args - Arguments to find a Activegames
     * @example
     * // Get one Activegames
     * const activegames = await prisma.activegames.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends activegamesFindFirstOrThrowArgs>(args?: SelectSubset<T, activegamesFindFirstOrThrowArgs<ExtArgs>>): Prisma__activegamesClient<$Result.GetResult<Prisma.$activegamesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Activegames that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {activegamesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Activegames
     * const activegames = await prisma.activegames.findMany()
     * 
     * // Get first 10 Activegames
     * const activegames = await prisma.activegames.findMany({ take: 10 })
     * 
     * // Only select the `gameid`
     * const activegamesWithGameidOnly = await prisma.activegames.findMany({ select: { gameid: true } })
     * 
     */
    findMany<T extends activegamesFindManyArgs>(args?: SelectSubset<T, activegamesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$activegamesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Activegames.
     * @param {activegamesCreateArgs} args - Arguments to create a Activegames.
     * @example
     * // Create one Activegames
     * const Activegames = await prisma.activegames.create({
     *   data: {
     *     // ... data to create a Activegames
     *   }
     * })
     * 
     */
    create<T extends activegamesCreateArgs>(args: SelectSubset<T, activegamesCreateArgs<ExtArgs>>): Prisma__activegamesClient<$Result.GetResult<Prisma.$activegamesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Activegames.
     * @param {activegamesCreateManyArgs} args - Arguments to create many Activegames.
     * @example
     * // Create many Activegames
     * const activegames = await prisma.activegames.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends activegamesCreateManyArgs>(args?: SelectSubset<T, activegamesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Activegames and returns the data saved in the database.
     * @param {activegamesCreateManyAndReturnArgs} args - Arguments to create many Activegames.
     * @example
     * // Create many Activegames
     * const activegames = await prisma.activegames.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Activegames and only return the `gameid`
     * const activegamesWithGameidOnly = await prisma.activegames.createManyAndReturn({
     *   select: { gameid: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends activegamesCreateManyAndReturnArgs>(args?: SelectSubset<T, activegamesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$activegamesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Activegames.
     * @param {activegamesDeleteArgs} args - Arguments to delete one Activegames.
     * @example
     * // Delete one Activegames
     * const Activegames = await prisma.activegames.delete({
     *   where: {
     *     // ... filter to delete one Activegames
     *   }
     * })
     * 
     */
    delete<T extends activegamesDeleteArgs>(args: SelectSubset<T, activegamesDeleteArgs<ExtArgs>>): Prisma__activegamesClient<$Result.GetResult<Prisma.$activegamesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Activegames.
     * @param {activegamesUpdateArgs} args - Arguments to update one Activegames.
     * @example
     * // Update one Activegames
     * const activegames = await prisma.activegames.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends activegamesUpdateArgs>(args: SelectSubset<T, activegamesUpdateArgs<ExtArgs>>): Prisma__activegamesClient<$Result.GetResult<Prisma.$activegamesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Activegames.
     * @param {activegamesDeleteManyArgs} args - Arguments to filter Activegames to delete.
     * @example
     * // Delete a few Activegames
     * const { count } = await prisma.activegames.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends activegamesDeleteManyArgs>(args?: SelectSubset<T, activegamesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Activegames.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {activegamesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Activegames
     * const activegames = await prisma.activegames.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends activegamesUpdateManyArgs>(args: SelectSubset<T, activegamesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Activegames and returns the data updated in the database.
     * @param {activegamesUpdateManyAndReturnArgs} args - Arguments to update many Activegames.
     * @example
     * // Update many Activegames
     * const activegames = await prisma.activegames.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Activegames and only return the `gameid`
     * const activegamesWithGameidOnly = await prisma.activegames.updateManyAndReturn({
     *   select: { gameid: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends activegamesUpdateManyAndReturnArgs>(args: SelectSubset<T, activegamesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$activegamesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Activegames.
     * @param {activegamesUpsertArgs} args - Arguments to update or create a Activegames.
     * @example
     * // Update or create a Activegames
     * const activegames = await prisma.activegames.upsert({
     *   create: {
     *     // ... data to create a Activegames
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Activegames we want to update
     *   }
     * })
     */
    upsert<T extends activegamesUpsertArgs>(args: SelectSubset<T, activegamesUpsertArgs<ExtArgs>>): Prisma__activegamesClient<$Result.GetResult<Prisma.$activegamesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Activegames.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {activegamesCountArgs} args - Arguments to filter Activegames to count.
     * @example
     * // Count the number of Activegames
     * const count = await prisma.activegames.count({
     *   where: {
     *     // ... the filter for the Activegames we want to count
     *   }
     * })
    **/
    count<T extends activegamesCountArgs>(
      args?: Subset<T, activegamesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ActivegamesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Activegames.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActivegamesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ActivegamesAggregateArgs>(args: Subset<T, ActivegamesAggregateArgs>): Prisma.PrismaPromise<GetActivegamesAggregateType<T>>

    /**
     * Group by Activegames.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {activegamesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends activegamesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: activegamesGroupByArgs['orderBy'] }
        : { orderBy?: activegamesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, activegamesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetActivegamesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the activegames model
   */
  readonly fields: activegamesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for activegames.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__activegamesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the activegames model
   */
  interface activegamesFieldRefs {
    readonly gameid: FieldRef<"activegames", 'String'>
    readonly black: FieldRef<"activegames", 'String'>
    readonly white: FieldRef<"activegames", 'String'>
    readonly createdat: FieldRef<"activegames", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * activegames findUnique
   */
  export type activegamesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the activegames
     */
    select?: activegamesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the activegames
     */
    omit?: activegamesOmit<ExtArgs> | null
    /**
     * Filter, which activegames to fetch.
     */
    where: activegamesWhereUniqueInput
  }

  /**
   * activegames findUniqueOrThrow
   */
  export type activegamesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the activegames
     */
    select?: activegamesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the activegames
     */
    omit?: activegamesOmit<ExtArgs> | null
    /**
     * Filter, which activegames to fetch.
     */
    where: activegamesWhereUniqueInput
  }

  /**
   * activegames findFirst
   */
  export type activegamesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the activegames
     */
    select?: activegamesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the activegames
     */
    omit?: activegamesOmit<ExtArgs> | null
    /**
     * Filter, which activegames to fetch.
     */
    where?: activegamesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of activegames to fetch.
     */
    orderBy?: activegamesOrderByWithRelationInput | activegamesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for activegames.
     */
    cursor?: activegamesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` activegames from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` activegames.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of activegames.
     */
    distinct?: ActivegamesScalarFieldEnum | ActivegamesScalarFieldEnum[]
  }

  /**
   * activegames findFirstOrThrow
   */
  export type activegamesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the activegames
     */
    select?: activegamesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the activegames
     */
    omit?: activegamesOmit<ExtArgs> | null
    /**
     * Filter, which activegames to fetch.
     */
    where?: activegamesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of activegames to fetch.
     */
    orderBy?: activegamesOrderByWithRelationInput | activegamesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for activegames.
     */
    cursor?: activegamesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` activegames from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` activegames.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of activegames.
     */
    distinct?: ActivegamesScalarFieldEnum | ActivegamesScalarFieldEnum[]
  }

  /**
   * activegames findMany
   */
  export type activegamesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the activegames
     */
    select?: activegamesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the activegames
     */
    omit?: activegamesOmit<ExtArgs> | null
    /**
     * Filter, which activegames to fetch.
     */
    where?: activegamesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of activegames to fetch.
     */
    orderBy?: activegamesOrderByWithRelationInput | activegamesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing activegames.
     */
    cursor?: activegamesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` activegames from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` activegames.
     */
    skip?: number
    distinct?: ActivegamesScalarFieldEnum | ActivegamesScalarFieldEnum[]
  }

  /**
   * activegames create
   */
  export type activegamesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the activegames
     */
    select?: activegamesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the activegames
     */
    omit?: activegamesOmit<ExtArgs> | null
    /**
     * The data needed to create a activegames.
     */
    data: XOR<activegamesCreateInput, activegamesUncheckedCreateInput>
  }

  /**
   * activegames createMany
   */
  export type activegamesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many activegames.
     */
    data: activegamesCreateManyInput | activegamesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * activegames createManyAndReturn
   */
  export type activegamesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the activegames
     */
    select?: activegamesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the activegames
     */
    omit?: activegamesOmit<ExtArgs> | null
    /**
     * The data used to create many activegames.
     */
    data: activegamesCreateManyInput | activegamesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * activegames update
   */
  export type activegamesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the activegames
     */
    select?: activegamesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the activegames
     */
    omit?: activegamesOmit<ExtArgs> | null
    /**
     * The data needed to update a activegames.
     */
    data: XOR<activegamesUpdateInput, activegamesUncheckedUpdateInput>
    /**
     * Choose, which activegames to update.
     */
    where: activegamesWhereUniqueInput
  }

  /**
   * activegames updateMany
   */
  export type activegamesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update activegames.
     */
    data: XOR<activegamesUpdateManyMutationInput, activegamesUncheckedUpdateManyInput>
    /**
     * Filter which activegames to update
     */
    where?: activegamesWhereInput
    /**
     * Limit how many activegames to update.
     */
    limit?: number
  }

  /**
   * activegames updateManyAndReturn
   */
  export type activegamesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the activegames
     */
    select?: activegamesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the activegames
     */
    omit?: activegamesOmit<ExtArgs> | null
    /**
     * The data used to update activegames.
     */
    data: XOR<activegamesUpdateManyMutationInput, activegamesUncheckedUpdateManyInput>
    /**
     * Filter which activegames to update
     */
    where?: activegamesWhereInput
    /**
     * Limit how many activegames to update.
     */
    limit?: number
  }

  /**
   * activegames upsert
   */
  export type activegamesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the activegames
     */
    select?: activegamesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the activegames
     */
    omit?: activegamesOmit<ExtArgs> | null
    /**
     * The filter to search for the activegames to update in case it exists.
     */
    where: activegamesWhereUniqueInput
    /**
     * In case the activegames found by the `where` argument doesn't exist, create a new activegames with this data.
     */
    create: XOR<activegamesCreateInput, activegamesUncheckedCreateInput>
    /**
     * In case the activegames was found with the provided `where` argument, update it with this data.
     */
    update: XOR<activegamesUpdateInput, activegamesUncheckedUpdateInput>
  }

  /**
   * activegames delete
   */
  export type activegamesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the activegames
     */
    select?: activegamesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the activegames
     */
    omit?: activegamesOmit<ExtArgs> | null
    /**
     * Filter which activegames to delete.
     */
    where: activegamesWhereUniqueInput
  }

  /**
   * activegames deleteMany
   */
  export type activegamesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which activegames to delete
     */
    where?: activegamesWhereInput
    /**
     * Limit how many activegames to delete.
     */
    limit?: number
  }

  /**
   * activegames without action
   */
  export type activegamesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the activegames
     */
    select?: activegamesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the activegames
     */
    omit?: activegamesOmit<ExtArgs> | null
  }


  /**
   * Model gamehistory
   */

  export type AggregateGamehistory = {
    _count: GamehistoryCountAggregateOutputType | null
    _min: GamehistoryMinAggregateOutputType | null
    _max: GamehistoryMaxAggregateOutputType | null
  }

  export type GamehistoryMinAggregateOutputType = {
    gameid: string | null
    playera: string | null
    playerb: string | null
    pgn: string | null
    createdat: Date | null
  }

  export type GamehistoryMaxAggregateOutputType = {
    gameid: string | null
    playera: string | null
    playerb: string | null
    pgn: string | null
    createdat: Date | null
  }

  export type GamehistoryCountAggregateOutputType = {
    gameid: number
    playera: number
    playerb: number
    pgn: number
    createdat: number
    _all: number
  }


  export type GamehistoryMinAggregateInputType = {
    gameid?: true
    playera?: true
    playerb?: true
    pgn?: true
    createdat?: true
  }

  export type GamehistoryMaxAggregateInputType = {
    gameid?: true
    playera?: true
    playerb?: true
    pgn?: true
    createdat?: true
  }

  export type GamehistoryCountAggregateInputType = {
    gameid?: true
    playera?: true
    playerb?: true
    pgn?: true
    createdat?: true
    _all?: true
  }

  export type GamehistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which gamehistory to aggregate.
     */
    where?: gamehistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of gamehistories to fetch.
     */
    orderBy?: gamehistoryOrderByWithRelationInput | gamehistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: gamehistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` gamehistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` gamehistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned gamehistories
    **/
    _count?: true | GamehistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GamehistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GamehistoryMaxAggregateInputType
  }

  export type GetGamehistoryAggregateType<T extends GamehistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateGamehistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGamehistory[P]>
      : GetScalarType<T[P], AggregateGamehistory[P]>
  }




  export type gamehistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: gamehistoryWhereInput
    orderBy?: gamehistoryOrderByWithAggregationInput | gamehistoryOrderByWithAggregationInput[]
    by: GamehistoryScalarFieldEnum[] | GamehistoryScalarFieldEnum
    having?: gamehistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GamehistoryCountAggregateInputType | true
    _min?: GamehistoryMinAggregateInputType
    _max?: GamehistoryMaxAggregateInputType
  }

  export type GamehistoryGroupByOutputType = {
    gameid: string
    playera: string
    playerb: string
    pgn: string
    createdat: Date | null
    _count: GamehistoryCountAggregateOutputType | null
    _min: GamehistoryMinAggregateOutputType | null
    _max: GamehistoryMaxAggregateOutputType | null
  }

  type GetGamehistoryGroupByPayload<T extends gamehistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GamehistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GamehistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GamehistoryGroupByOutputType[P]>
            : GetScalarType<T[P], GamehistoryGroupByOutputType[P]>
        }
      >
    >


  export type gamehistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    gameid?: boolean
    playera?: boolean
    playerb?: boolean
    pgn?: boolean
    createdat?: boolean
  }, ExtArgs["result"]["gamehistory"]>

  export type gamehistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    gameid?: boolean
    playera?: boolean
    playerb?: boolean
    pgn?: boolean
    createdat?: boolean
  }, ExtArgs["result"]["gamehistory"]>

  export type gamehistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    gameid?: boolean
    playera?: boolean
    playerb?: boolean
    pgn?: boolean
    createdat?: boolean
  }, ExtArgs["result"]["gamehistory"]>

  export type gamehistorySelectScalar = {
    gameid?: boolean
    playera?: boolean
    playerb?: boolean
    pgn?: boolean
    createdat?: boolean
  }

  export type gamehistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"gameid" | "playera" | "playerb" | "pgn" | "createdat", ExtArgs["result"]["gamehistory"]>

  export type $gamehistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "gamehistory"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      gameid: string
      playera: string
      playerb: string
      pgn: string
      createdat: Date | null
    }, ExtArgs["result"]["gamehistory"]>
    composites: {}
  }

  type gamehistoryGetPayload<S extends boolean | null | undefined | gamehistoryDefaultArgs> = $Result.GetResult<Prisma.$gamehistoryPayload, S>

  type gamehistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<gamehistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GamehistoryCountAggregateInputType | true
    }

  export interface gamehistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['gamehistory'], meta: { name: 'gamehistory' } }
    /**
     * Find zero or one Gamehistory that matches the filter.
     * @param {gamehistoryFindUniqueArgs} args - Arguments to find a Gamehistory
     * @example
     * // Get one Gamehistory
     * const gamehistory = await prisma.gamehistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends gamehistoryFindUniqueArgs>(args: SelectSubset<T, gamehistoryFindUniqueArgs<ExtArgs>>): Prisma__gamehistoryClient<$Result.GetResult<Prisma.$gamehistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Gamehistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {gamehistoryFindUniqueOrThrowArgs} args - Arguments to find a Gamehistory
     * @example
     * // Get one Gamehistory
     * const gamehistory = await prisma.gamehistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends gamehistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, gamehistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__gamehistoryClient<$Result.GetResult<Prisma.$gamehistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Gamehistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {gamehistoryFindFirstArgs} args - Arguments to find a Gamehistory
     * @example
     * // Get one Gamehistory
     * const gamehistory = await prisma.gamehistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends gamehistoryFindFirstArgs>(args?: SelectSubset<T, gamehistoryFindFirstArgs<ExtArgs>>): Prisma__gamehistoryClient<$Result.GetResult<Prisma.$gamehistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Gamehistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {gamehistoryFindFirstOrThrowArgs} args - Arguments to find a Gamehistory
     * @example
     * // Get one Gamehistory
     * const gamehistory = await prisma.gamehistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends gamehistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, gamehistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__gamehistoryClient<$Result.GetResult<Prisma.$gamehistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Gamehistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {gamehistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Gamehistories
     * const gamehistories = await prisma.gamehistory.findMany()
     * 
     * // Get first 10 Gamehistories
     * const gamehistories = await prisma.gamehistory.findMany({ take: 10 })
     * 
     * // Only select the `gameid`
     * const gamehistoryWithGameidOnly = await prisma.gamehistory.findMany({ select: { gameid: true } })
     * 
     */
    findMany<T extends gamehistoryFindManyArgs>(args?: SelectSubset<T, gamehistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$gamehistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Gamehistory.
     * @param {gamehistoryCreateArgs} args - Arguments to create a Gamehistory.
     * @example
     * // Create one Gamehistory
     * const Gamehistory = await prisma.gamehistory.create({
     *   data: {
     *     // ... data to create a Gamehistory
     *   }
     * })
     * 
     */
    create<T extends gamehistoryCreateArgs>(args: SelectSubset<T, gamehistoryCreateArgs<ExtArgs>>): Prisma__gamehistoryClient<$Result.GetResult<Prisma.$gamehistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Gamehistories.
     * @param {gamehistoryCreateManyArgs} args - Arguments to create many Gamehistories.
     * @example
     * // Create many Gamehistories
     * const gamehistory = await prisma.gamehistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends gamehistoryCreateManyArgs>(args?: SelectSubset<T, gamehistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Gamehistories and returns the data saved in the database.
     * @param {gamehistoryCreateManyAndReturnArgs} args - Arguments to create many Gamehistories.
     * @example
     * // Create many Gamehistories
     * const gamehistory = await prisma.gamehistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Gamehistories and only return the `gameid`
     * const gamehistoryWithGameidOnly = await prisma.gamehistory.createManyAndReturn({
     *   select: { gameid: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends gamehistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, gamehistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$gamehistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Gamehistory.
     * @param {gamehistoryDeleteArgs} args - Arguments to delete one Gamehistory.
     * @example
     * // Delete one Gamehistory
     * const Gamehistory = await prisma.gamehistory.delete({
     *   where: {
     *     // ... filter to delete one Gamehistory
     *   }
     * })
     * 
     */
    delete<T extends gamehistoryDeleteArgs>(args: SelectSubset<T, gamehistoryDeleteArgs<ExtArgs>>): Prisma__gamehistoryClient<$Result.GetResult<Prisma.$gamehistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Gamehistory.
     * @param {gamehistoryUpdateArgs} args - Arguments to update one Gamehistory.
     * @example
     * // Update one Gamehistory
     * const gamehistory = await prisma.gamehistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends gamehistoryUpdateArgs>(args: SelectSubset<T, gamehistoryUpdateArgs<ExtArgs>>): Prisma__gamehistoryClient<$Result.GetResult<Prisma.$gamehistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Gamehistories.
     * @param {gamehistoryDeleteManyArgs} args - Arguments to filter Gamehistories to delete.
     * @example
     * // Delete a few Gamehistories
     * const { count } = await prisma.gamehistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends gamehistoryDeleteManyArgs>(args?: SelectSubset<T, gamehistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Gamehistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {gamehistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Gamehistories
     * const gamehistory = await prisma.gamehistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends gamehistoryUpdateManyArgs>(args: SelectSubset<T, gamehistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Gamehistories and returns the data updated in the database.
     * @param {gamehistoryUpdateManyAndReturnArgs} args - Arguments to update many Gamehistories.
     * @example
     * // Update many Gamehistories
     * const gamehistory = await prisma.gamehistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Gamehistories and only return the `gameid`
     * const gamehistoryWithGameidOnly = await prisma.gamehistory.updateManyAndReturn({
     *   select: { gameid: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends gamehistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, gamehistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$gamehistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Gamehistory.
     * @param {gamehistoryUpsertArgs} args - Arguments to update or create a Gamehistory.
     * @example
     * // Update or create a Gamehistory
     * const gamehistory = await prisma.gamehistory.upsert({
     *   create: {
     *     // ... data to create a Gamehistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Gamehistory we want to update
     *   }
     * })
     */
    upsert<T extends gamehistoryUpsertArgs>(args: SelectSubset<T, gamehistoryUpsertArgs<ExtArgs>>): Prisma__gamehistoryClient<$Result.GetResult<Prisma.$gamehistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Gamehistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {gamehistoryCountArgs} args - Arguments to filter Gamehistories to count.
     * @example
     * // Count the number of Gamehistories
     * const count = await prisma.gamehistory.count({
     *   where: {
     *     // ... the filter for the Gamehistories we want to count
     *   }
     * })
    **/
    count<T extends gamehistoryCountArgs>(
      args?: Subset<T, gamehistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GamehistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Gamehistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GamehistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GamehistoryAggregateArgs>(args: Subset<T, GamehistoryAggregateArgs>): Prisma.PrismaPromise<GetGamehistoryAggregateType<T>>

    /**
     * Group by Gamehistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {gamehistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends gamehistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: gamehistoryGroupByArgs['orderBy'] }
        : { orderBy?: gamehistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, gamehistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGamehistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the gamehistory model
   */
  readonly fields: gamehistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for gamehistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__gamehistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the gamehistory model
   */
  interface gamehistoryFieldRefs {
    readonly gameid: FieldRef<"gamehistory", 'String'>
    readonly playera: FieldRef<"gamehistory", 'String'>
    readonly playerb: FieldRef<"gamehistory", 'String'>
    readonly pgn: FieldRef<"gamehistory", 'String'>
    readonly createdat: FieldRef<"gamehistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * gamehistory findUnique
   */
  export type gamehistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the gamehistory
     */
    select?: gamehistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the gamehistory
     */
    omit?: gamehistoryOmit<ExtArgs> | null
    /**
     * Filter, which gamehistory to fetch.
     */
    where: gamehistoryWhereUniqueInput
  }

  /**
   * gamehistory findUniqueOrThrow
   */
  export type gamehistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the gamehistory
     */
    select?: gamehistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the gamehistory
     */
    omit?: gamehistoryOmit<ExtArgs> | null
    /**
     * Filter, which gamehistory to fetch.
     */
    where: gamehistoryWhereUniqueInput
  }

  /**
   * gamehistory findFirst
   */
  export type gamehistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the gamehistory
     */
    select?: gamehistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the gamehistory
     */
    omit?: gamehistoryOmit<ExtArgs> | null
    /**
     * Filter, which gamehistory to fetch.
     */
    where?: gamehistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of gamehistories to fetch.
     */
    orderBy?: gamehistoryOrderByWithRelationInput | gamehistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for gamehistories.
     */
    cursor?: gamehistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` gamehistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` gamehistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of gamehistories.
     */
    distinct?: GamehistoryScalarFieldEnum | GamehistoryScalarFieldEnum[]
  }

  /**
   * gamehistory findFirstOrThrow
   */
  export type gamehistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the gamehistory
     */
    select?: gamehistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the gamehistory
     */
    omit?: gamehistoryOmit<ExtArgs> | null
    /**
     * Filter, which gamehistory to fetch.
     */
    where?: gamehistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of gamehistories to fetch.
     */
    orderBy?: gamehistoryOrderByWithRelationInput | gamehistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for gamehistories.
     */
    cursor?: gamehistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` gamehistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` gamehistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of gamehistories.
     */
    distinct?: GamehistoryScalarFieldEnum | GamehistoryScalarFieldEnum[]
  }

  /**
   * gamehistory findMany
   */
  export type gamehistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the gamehistory
     */
    select?: gamehistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the gamehistory
     */
    omit?: gamehistoryOmit<ExtArgs> | null
    /**
     * Filter, which gamehistories to fetch.
     */
    where?: gamehistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of gamehistories to fetch.
     */
    orderBy?: gamehistoryOrderByWithRelationInput | gamehistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing gamehistories.
     */
    cursor?: gamehistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` gamehistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` gamehistories.
     */
    skip?: number
    distinct?: GamehistoryScalarFieldEnum | GamehistoryScalarFieldEnum[]
  }

  /**
   * gamehistory create
   */
  export type gamehistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the gamehistory
     */
    select?: gamehistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the gamehistory
     */
    omit?: gamehistoryOmit<ExtArgs> | null
    /**
     * The data needed to create a gamehistory.
     */
    data: XOR<gamehistoryCreateInput, gamehistoryUncheckedCreateInput>
  }

  /**
   * gamehistory createMany
   */
  export type gamehistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many gamehistories.
     */
    data: gamehistoryCreateManyInput | gamehistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * gamehistory createManyAndReturn
   */
  export type gamehistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the gamehistory
     */
    select?: gamehistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the gamehistory
     */
    omit?: gamehistoryOmit<ExtArgs> | null
    /**
     * The data used to create many gamehistories.
     */
    data: gamehistoryCreateManyInput | gamehistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * gamehistory update
   */
  export type gamehistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the gamehistory
     */
    select?: gamehistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the gamehistory
     */
    omit?: gamehistoryOmit<ExtArgs> | null
    /**
     * The data needed to update a gamehistory.
     */
    data: XOR<gamehistoryUpdateInput, gamehistoryUncheckedUpdateInput>
    /**
     * Choose, which gamehistory to update.
     */
    where: gamehistoryWhereUniqueInput
  }

  /**
   * gamehistory updateMany
   */
  export type gamehistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update gamehistories.
     */
    data: XOR<gamehistoryUpdateManyMutationInput, gamehistoryUncheckedUpdateManyInput>
    /**
     * Filter which gamehistories to update
     */
    where?: gamehistoryWhereInput
    /**
     * Limit how many gamehistories to update.
     */
    limit?: number
  }

  /**
   * gamehistory updateManyAndReturn
   */
  export type gamehistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the gamehistory
     */
    select?: gamehistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the gamehistory
     */
    omit?: gamehistoryOmit<ExtArgs> | null
    /**
     * The data used to update gamehistories.
     */
    data: XOR<gamehistoryUpdateManyMutationInput, gamehistoryUncheckedUpdateManyInput>
    /**
     * Filter which gamehistories to update
     */
    where?: gamehistoryWhereInput
    /**
     * Limit how many gamehistories to update.
     */
    limit?: number
  }

  /**
   * gamehistory upsert
   */
  export type gamehistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the gamehistory
     */
    select?: gamehistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the gamehistory
     */
    omit?: gamehistoryOmit<ExtArgs> | null
    /**
     * The filter to search for the gamehistory to update in case it exists.
     */
    where: gamehistoryWhereUniqueInput
    /**
     * In case the gamehistory found by the `where` argument doesn't exist, create a new gamehistory with this data.
     */
    create: XOR<gamehistoryCreateInput, gamehistoryUncheckedCreateInput>
    /**
     * In case the gamehistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<gamehistoryUpdateInput, gamehistoryUncheckedUpdateInput>
  }

  /**
   * gamehistory delete
   */
  export type gamehistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the gamehistory
     */
    select?: gamehistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the gamehistory
     */
    omit?: gamehistoryOmit<ExtArgs> | null
    /**
     * Filter which gamehistory to delete.
     */
    where: gamehistoryWhereUniqueInput
  }

  /**
   * gamehistory deleteMany
   */
  export type gamehistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which gamehistories to delete
     */
    where?: gamehistoryWhereInput
    /**
     * Limit how many gamehistories to delete.
     */
    limit?: number
  }

  /**
   * gamehistory without action
   */
  export type gamehistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the gamehistory
     */
    select?: gamehistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the gamehistory
     */
    omit?: gamehistoryOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const Diesel_schema_migrationsScalarFieldEnum: {
    version: 'version',
    run_on: 'run_on'
  };

  export type Diesel_schema_migrationsScalarFieldEnum = (typeof Diesel_schema_migrationsScalarFieldEnum)[keyof typeof Diesel_schema_migrationsScalarFieldEnum]


  export const ActivegamesScalarFieldEnum: {
    gameid: 'gameid',
    black: 'black',
    white: 'white',
    createdat: 'createdat'
  };

  export type ActivegamesScalarFieldEnum = (typeof ActivegamesScalarFieldEnum)[keyof typeof ActivegamesScalarFieldEnum]


  export const GamehistoryScalarFieldEnum: {
    gameid: 'gameid',
    playera: 'playera',
    playerb: 'playerb',
    pgn: 'pgn',
    createdat: 'createdat'
  };

  export type GamehistoryScalarFieldEnum = (typeof GamehistoryScalarFieldEnum)[keyof typeof GamehistoryScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type diesel_schema_migrationsWhereInput = {
    AND?: diesel_schema_migrationsWhereInput | diesel_schema_migrationsWhereInput[]
    OR?: diesel_schema_migrationsWhereInput[]
    NOT?: diesel_schema_migrationsWhereInput | diesel_schema_migrationsWhereInput[]
    version?: StringFilter<"diesel_schema_migrations"> | string
    run_on?: DateTimeFilter<"diesel_schema_migrations"> | Date | string
  }

  export type diesel_schema_migrationsOrderByWithRelationInput = {
    version?: SortOrder
    run_on?: SortOrder
  }

  export type diesel_schema_migrationsWhereUniqueInput = Prisma.AtLeast<{
    version?: string
    AND?: diesel_schema_migrationsWhereInput | diesel_schema_migrationsWhereInput[]
    OR?: diesel_schema_migrationsWhereInput[]
    NOT?: diesel_schema_migrationsWhereInput | diesel_schema_migrationsWhereInput[]
    run_on?: DateTimeFilter<"diesel_schema_migrations"> | Date | string
  }, "version">

  export type diesel_schema_migrationsOrderByWithAggregationInput = {
    version?: SortOrder
    run_on?: SortOrder
    _count?: diesel_schema_migrationsCountOrderByAggregateInput
    _max?: diesel_schema_migrationsMaxOrderByAggregateInput
    _min?: diesel_schema_migrationsMinOrderByAggregateInput
  }

  export type diesel_schema_migrationsScalarWhereWithAggregatesInput = {
    AND?: diesel_schema_migrationsScalarWhereWithAggregatesInput | diesel_schema_migrationsScalarWhereWithAggregatesInput[]
    OR?: diesel_schema_migrationsScalarWhereWithAggregatesInput[]
    NOT?: diesel_schema_migrationsScalarWhereWithAggregatesInput | diesel_schema_migrationsScalarWhereWithAggregatesInput[]
    version?: StringWithAggregatesFilter<"diesel_schema_migrations"> | string
    run_on?: DateTimeWithAggregatesFilter<"diesel_schema_migrations"> | Date | string
  }

  export type activegamesWhereInput = {
    AND?: activegamesWhereInput | activegamesWhereInput[]
    OR?: activegamesWhereInput[]
    NOT?: activegamesWhereInput | activegamesWhereInput[]
    gameid?: UuidFilter<"activegames"> | string
    black?: StringFilter<"activegames"> | string
    white?: StringFilter<"activegames"> | string
    createdat?: DateTimeNullableFilter<"activegames"> | Date | string | null
  }

  export type activegamesOrderByWithRelationInput = {
    gameid?: SortOrder
    black?: SortOrder
    white?: SortOrder
    createdat?: SortOrderInput | SortOrder
  }

  export type activegamesWhereUniqueInput = Prisma.AtLeast<{
    gameid?: string
    AND?: activegamesWhereInput | activegamesWhereInput[]
    OR?: activegamesWhereInput[]
    NOT?: activegamesWhereInput | activegamesWhereInput[]
    black?: StringFilter<"activegames"> | string
    white?: StringFilter<"activegames"> | string
    createdat?: DateTimeNullableFilter<"activegames"> | Date | string | null
  }, "gameid">

  export type activegamesOrderByWithAggregationInput = {
    gameid?: SortOrder
    black?: SortOrder
    white?: SortOrder
    createdat?: SortOrderInput | SortOrder
    _count?: activegamesCountOrderByAggregateInput
    _max?: activegamesMaxOrderByAggregateInput
    _min?: activegamesMinOrderByAggregateInput
  }

  export type activegamesScalarWhereWithAggregatesInput = {
    AND?: activegamesScalarWhereWithAggregatesInput | activegamesScalarWhereWithAggregatesInput[]
    OR?: activegamesScalarWhereWithAggregatesInput[]
    NOT?: activegamesScalarWhereWithAggregatesInput | activegamesScalarWhereWithAggregatesInput[]
    gameid?: UuidWithAggregatesFilter<"activegames"> | string
    black?: StringWithAggregatesFilter<"activegames"> | string
    white?: StringWithAggregatesFilter<"activegames"> | string
    createdat?: DateTimeNullableWithAggregatesFilter<"activegames"> | Date | string | null
  }

  export type gamehistoryWhereInput = {
    AND?: gamehistoryWhereInput | gamehistoryWhereInput[]
    OR?: gamehistoryWhereInput[]
    NOT?: gamehistoryWhereInput | gamehistoryWhereInput[]
    gameid?: UuidFilter<"gamehistory"> | string
    playera?: StringFilter<"gamehistory"> | string
    playerb?: StringFilter<"gamehistory"> | string
    pgn?: StringFilter<"gamehistory"> | string
    createdat?: DateTimeNullableFilter<"gamehistory"> | Date | string | null
  }

  export type gamehistoryOrderByWithRelationInput = {
    gameid?: SortOrder
    playera?: SortOrder
    playerb?: SortOrder
    pgn?: SortOrder
    createdat?: SortOrderInput | SortOrder
  }

  export type gamehistoryWhereUniqueInput = Prisma.AtLeast<{
    gameid?: string
    AND?: gamehistoryWhereInput | gamehistoryWhereInput[]
    OR?: gamehistoryWhereInput[]
    NOT?: gamehistoryWhereInput | gamehistoryWhereInput[]
    playera?: StringFilter<"gamehistory"> | string
    playerb?: StringFilter<"gamehistory"> | string
    pgn?: StringFilter<"gamehistory"> | string
    createdat?: DateTimeNullableFilter<"gamehistory"> | Date | string | null
  }, "gameid">

  export type gamehistoryOrderByWithAggregationInput = {
    gameid?: SortOrder
    playera?: SortOrder
    playerb?: SortOrder
    pgn?: SortOrder
    createdat?: SortOrderInput | SortOrder
    _count?: gamehistoryCountOrderByAggregateInput
    _max?: gamehistoryMaxOrderByAggregateInput
    _min?: gamehistoryMinOrderByAggregateInput
  }

  export type gamehistoryScalarWhereWithAggregatesInput = {
    AND?: gamehistoryScalarWhereWithAggregatesInput | gamehistoryScalarWhereWithAggregatesInput[]
    OR?: gamehistoryScalarWhereWithAggregatesInput[]
    NOT?: gamehistoryScalarWhereWithAggregatesInput | gamehistoryScalarWhereWithAggregatesInput[]
    gameid?: UuidWithAggregatesFilter<"gamehistory"> | string
    playera?: StringWithAggregatesFilter<"gamehistory"> | string
    playerb?: StringWithAggregatesFilter<"gamehistory"> | string
    pgn?: StringWithAggregatesFilter<"gamehistory"> | string
    createdat?: DateTimeNullableWithAggregatesFilter<"gamehistory"> | Date | string | null
  }

  export type diesel_schema_migrationsCreateInput = {
    version: string
    run_on?: Date | string
  }

  export type diesel_schema_migrationsUncheckedCreateInput = {
    version: string
    run_on?: Date | string
  }

  export type diesel_schema_migrationsUpdateInput = {
    version?: StringFieldUpdateOperationsInput | string
    run_on?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type diesel_schema_migrationsUncheckedUpdateInput = {
    version?: StringFieldUpdateOperationsInput | string
    run_on?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type diesel_schema_migrationsCreateManyInput = {
    version: string
    run_on?: Date | string
  }

  export type diesel_schema_migrationsUpdateManyMutationInput = {
    version?: StringFieldUpdateOperationsInput | string
    run_on?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type diesel_schema_migrationsUncheckedUpdateManyInput = {
    version?: StringFieldUpdateOperationsInput | string
    run_on?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type activegamesCreateInput = {
    gameid: string
    black: string
    white: string
    createdat?: Date | string | null
  }

  export type activegamesUncheckedCreateInput = {
    gameid: string
    black: string
    white: string
    createdat?: Date | string | null
  }

  export type activegamesUpdateInput = {
    gameid?: StringFieldUpdateOperationsInput | string
    black?: StringFieldUpdateOperationsInput | string
    white?: StringFieldUpdateOperationsInput | string
    createdat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type activegamesUncheckedUpdateInput = {
    gameid?: StringFieldUpdateOperationsInput | string
    black?: StringFieldUpdateOperationsInput | string
    white?: StringFieldUpdateOperationsInput | string
    createdat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type activegamesCreateManyInput = {
    gameid: string
    black: string
    white: string
    createdat?: Date | string | null
  }

  export type activegamesUpdateManyMutationInput = {
    gameid?: StringFieldUpdateOperationsInput | string
    black?: StringFieldUpdateOperationsInput | string
    white?: StringFieldUpdateOperationsInput | string
    createdat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type activegamesUncheckedUpdateManyInput = {
    gameid?: StringFieldUpdateOperationsInput | string
    black?: StringFieldUpdateOperationsInput | string
    white?: StringFieldUpdateOperationsInput | string
    createdat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type gamehistoryCreateInput = {
    gameid: string
    playera: string
    playerb: string
    pgn: string
    createdat?: Date | string | null
  }

  export type gamehistoryUncheckedCreateInput = {
    gameid: string
    playera: string
    playerb: string
    pgn: string
    createdat?: Date | string | null
  }

  export type gamehistoryUpdateInput = {
    gameid?: StringFieldUpdateOperationsInput | string
    playera?: StringFieldUpdateOperationsInput | string
    playerb?: StringFieldUpdateOperationsInput | string
    pgn?: StringFieldUpdateOperationsInput | string
    createdat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type gamehistoryUncheckedUpdateInput = {
    gameid?: StringFieldUpdateOperationsInput | string
    playera?: StringFieldUpdateOperationsInput | string
    playerb?: StringFieldUpdateOperationsInput | string
    pgn?: StringFieldUpdateOperationsInput | string
    createdat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type gamehistoryCreateManyInput = {
    gameid: string
    playera: string
    playerb: string
    pgn: string
    createdat?: Date | string | null
  }

  export type gamehistoryUpdateManyMutationInput = {
    gameid?: StringFieldUpdateOperationsInput | string
    playera?: StringFieldUpdateOperationsInput | string
    playerb?: StringFieldUpdateOperationsInput | string
    pgn?: StringFieldUpdateOperationsInput | string
    createdat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type gamehistoryUncheckedUpdateManyInput = {
    gameid?: StringFieldUpdateOperationsInput | string
    playera?: StringFieldUpdateOperationsInput | string
    playerb?: StringFieldUpdateOperationsInput | string
    pgn?: StringFieldUpdateOperationsInput | string
    createdat?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type diesel_schema_migrationsCountOrderByAggregateInput = {
    version?: SortOrder
    run_on?: SortOrder
  }

  export type diesel_schema_migrationsMaxOrderByAggregateInput = {
    version?: SortOrder
    run_on?: SortOrder
  }

  export type diesel_schema_migrationsMinOrderByAggregateInput = {
    version?: SortOrder
    run_on?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type activegamesCountOrderByAggregateInput = {
    gameid?: SortOrder
    black?: SortOrder
    white?: SortOrder
    createdat?: SortOrder
  }

  export type activegamesMaxOrderByAggregateInput = {
    gameid?: SortOrder
    black?: SortOrder
    white?: SortOrder
    createdat?: SortOrder
  }

  export type activegamesMinOrderByAggregateInput = {
    gameid?: SortOrder
    black?: SortOrder
    white?: SortOrder
    createdat?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type gamehistoryCountOrderByAggregateInput = {
    gameid?: SortOrder
    playera?: SortOrder
    playerb?: SortOrder
    pgn?: SortOrder
    createdat?: SortOrder
  }

  export type gamehistoryMaxOrderByAggregateInput = {
    gameid?: SortOrder
    playera?: SortOrder
    playerb?: SortOrder
    pgn?: SortOrder
    createdat?: SortOrder
  }

  export type gamehistoryMinOrderByAggregateInput = {
    gameid?: SortOrder
    playera?: SortOrder
    playerb?: SortOrder
    pgn?: SortOrder
    createdat?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}