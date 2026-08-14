/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  JSON: { input: any; output: any; }
};

export type Account = {
  __typename?: 'Account';
  createdAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['String']['output'];
  personId: Scalars['ID']['output'];
  provider?: Maybe<Scalars['String']['output']>;
  remoteUsers?: Maybe<Array<RemoteUser>>;
  status: AccountStatus;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  username: Scalars['String']['output'];
};

export enum AccountStatus {
  Active = 'ACTIVE',
  Deactivated = 'DEACTIVATED',
  Pending = 'PENDING',
  Suspended = 'SUSPENDED'
}

export type AnnotationInput = {
  body: Scalars['String']['input'];
  endOffset: Scalars['Int']['input'];
  startOffset: Scalars['Int']['input'];
  textId: Scalars['ID']['input'];
};

export type AuthResult = {
  __typename?: 'AuthResult';
  accountId: Scalars['ID']['output'];
  personId: Scalars['ID']['output'];
  token: Scalars['String']['output'];
};

export type BlogMutations = {
  __typename?: 'BlogMutations';
  createBlogPost?: Maybe<QueryResult>;
  createBlogPostType?: Maybe<QueryResult>;
};


export type BlogMutationsCreateBlogPostArgs = {
  input?: InputMaybe<BlogPostInput>;
  title: Scalars['String']['input'];
};


export type BlogMutationsCreateBlogPostTypeArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type BlogPost = {
  __typename?: 'BlogPost';
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['String']['output'];
  language?: Maybe<Scalars['String']['output']>;
  remoteObject?: Maybe<Array<Scalars['String']['output']>>;
  tags?: Maybe<Array<Scalars['String']['output']>>;
  title: Scalars['String']['output'];
  type?: Maybe<BlogPostType>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type BlogPostInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  remoteObject?: InputMaybe<Array<Scalars['String']['input']>>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  typeId?: InputMaybe<Scalars['ID']['input']>;
};

export type BlogPostType = {
  __typename?: 'BlogPostType';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type BlogQueries = {
  __typename?: 'BlogQueries';
  blogPostTypes: Array<BlogPostType>;
  listBlogPosts: PagedBlogPosts;
  listByRemoteObjects?: Maybe<Array<Maybe<BlogPost>>>;
  locateBlogPost?: Maybe<BlogPost>;
};


export type BlogQueriesListBlogPostsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type BlogQueriesListByRemoteObjectsArgs = {
  ids: Array<Scalars['String']['input']>;
};


export type BlogQueriesLocateBlogPostArgs = {
  id: Scalars['ID']['input'];
};

export enum CefrLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2'
}

export type CommentInput = {
  annotationId: Scalars['ID']['input'];
  body: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

/** A contributing complexity factor with a direction (up/down). */
export type ComplexityFactor = {
  __typename?: 'ComplexityFactor';
  direction: Scalars['String']['output'];
  name: Scalars['String']['output'];
  value: Scalars['Float']['output'];
  weight: Scalars['Float']['output'];
};

export type DiscordLoginResult = {
  __typename?: 'DiscordLoginResult';
  accountId: Scalars['ID']['output'];
  readerAccountId: Scalars['ID']['output'];
  requiresReactivation: Scalars['Boolean']['output'];
  token: Scalars['String']['output'];
};

/** A single filter applied to a paginated query. */
export type FilterInput = {
  field: Scalars['String']['input'];
  operator: FilterOperator;
  value: Scalars['String']['input'];
};

/** Operators for FilterInput. */
export enum FilterOperator {
  EndsWith = 'ENDS_WITH',
  Equals = 'EQUALS',
  GreaterThan = 'GREATER_THAN',
  GreaterThanOrEqual = 'GREATER_THAN_OR_EQUAL',
  In = 'IN',
  LessThan = 'LESS_THAN',
  LessThanOrEqual = 'LESS_THAN_OR_EQUAL',
  Matches = 'MATCHES',
  NotEquals = 'NOT_EQUALS',
  StartsWith = 'STARTS_WITH'
}

export type GaiaMutations = {
  __typename?: 'GaiaMutations';
  confirmAccountReactivation?: Maybe<QueryResult>;
  deactivateAccount?: Maybe<QueryResult>;
  login?: Maybe<AuthResult>;
  requestAccountReactivation?: Maybe<QueryResult>;
  suspendAccount?: Maybe<QueryResult>;
  unsuspendAccount?: Maybe<QueryResult>;
};


export type GaiaMutationsConfirmAccountReactivationArgs = {
  token: Scalars['String']['input'];
};


export type GaiaMutationsLoginArgs = {
  input: LoginInput;
};


export type GaiaMutationsRequestAccountReactivationArgs = {
  email: Scalars['String']['input'];
  provider: Scalars['String']['input'];
};


export type GaiaMutationsSuspendAccountArgs = {
  id: Scalars['ID']['input'];
};


export type GaiaMutationsUnsuspendAccountArgs = {
  id: Scalars['ID']['input'];
};

export type GaiaQueries = {
  __typename?: 'GaiaQueries';
  account?: Maybe<Account>;
  accounts: PagedAccounts;
  myRoles: Array<Scalars['String']['output']>;
  propertySet?: Maybe<Scalars['JSON']['output']>;
};


export type GaiaQueriesAccountArgs = {
  id: Scalars['ID']['input'];
};


export type GaiaQueriesAccountsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type GaiaQueriesPropertySetArgs = {
  entry?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  ownerKey: Scalars['String']['input'];
};

export type HadesMutations = {
  __typename?: 'HadesMutations';
  addComment?: Maybe<QueryResult>;
  archiveText?: Maybe<QueryResult>;
  attachObject?: Maybe<QueryResult>;
  createAnnotation?: Maybe<QueryResult>;
  createSource?: Maybe<QueryResult>;
  createText?: Maybe<QueryResult>;
  deleteAnnotation?: Maybe<QueryResult>;
  deleteComment?: Maybe<QueryResult>;
  discordLogin?: Maybe<DiscordLoginResult>;
  editAnnotation?: Maybe<QueryResult>;
  editComment?: Maybe<QueryResult>;
  removeVote?: Maybe<QueryResult>;
  vote?: Maybe<QueryResult>;
};


export type HadesMutationsAddCommentArgs = {
  input: CommentInput;
};


export type HadesMutationsArchiveTextArgs = {
  id: Scalars['ID']['input'];
};


export type HadesMutationsAttachObjectArgs = {
  source: Scalars['ID']['input'];
  target: Scalars['String']['input'];
};


export type HadesMutationsCreateAnnotationArgs = {
  input: AnnotationInput;
};


export type HadesMutationsCreateSourceArgs = {
  name: Scalars['String']['input'];
  url: Scalars['String']['input'];
};


export type HadesMutationsCreateTextArgs = {
  input: ReaderTextInput;
};


export type HadesMutationsDeleteAnnotationArgs = {
  id: Scalars['ID']['input'];
};


export type HadesMutationsDeleteCommentArgs = {
  id: Scalars['ID']['input'];
};


export type HadesMutationsDiscordLoginArgs = {
  code: Scalars['String']['input'];
  state: Scalars['String']['input'];
};


export type HadesMutationsEditAnnotationArgs = {
  body: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


export type HadesMutationsEditCommentArgs = {
  body: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


export type HadesMutationsRemoveVoteArgs = {
  targetId: Scalars['ID']['input'];
  targetType: ReaderVoteTarget;
};


export type HadesMutationsVoteArgs = {
  input: VoteInput;
};

export type HadesQueries = {
  __typename?: 'HadesQueries';
  annotation?: Maybe<ReaderAnnotation>;
  annotations: Array<ReaderAnnotation>;
  classifyTextLevel?: Maybe<TextLevelAssessment>;
  comments: PagedReaderComments;
  locateRemoteObjects: Array<ReaderObjectReference>;
  myVote?: Maybe<VoteValue>;
  readerAccount?: Maybe<ReaderAccount>;
  readerAccounts: Array<ReaderAccount>;
  source?: Maybe<ReaderSource>;
  sources?: Maybe<Array<ReaderSource>>;
  text?: Maybe<ReaderText>;
  texts: PagedReaderTexts;
};


export type HadesQueriesAnnotationArgs = {
  id: Scalars['ID']['input'];
};


export type HadesQueriesAnnotationsArgs = {
  includeHidden?: InputMaybe<Scalars['Boolean']['input']>;
  textId: Scalars['ID']['input'];
};


export type HadesQueriesClassifyTextLevelArgs = {
  text: Scalars['String']['input'];
};


export type HadesQueriesCommentsArgs = {
  annotationId: Scalars['ID']['input'];
  includeHidden?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationInput>;
};


export type HadesQueriesLocateRemoteObjectsArgs = {
  ids: Array<Scalars['String']['input']>;
};


export type HadesQueriesMyVoteArgs = {
  targetId: Scalars['ID']['input'];
  targetType: ReaderVoteTarget;
};


export type HadesQueriesReaderAccountsArgs = {
  remoteUsers: Array<RemoteUserInput>;
};


export type HadesQueriesSourceArgs = {
  id: Scalars['ID']['input'];
};


export type HadesQueriesTextArgs = {
  id: Scalars['ID']['input'];
};


export type HadesQueriesTextsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

/** Predicted probability for a single CEFR level. */
export type LevelProbability = {
  __typename?: 'LevelProbability';
  level: CefrLevel;
  probability: Scalars['Float']['output'];
};

export type LoginInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  blogMutations: BlogMutations;
  gaiaMutations: GaiaMutations;
  hadesMutations: HadesMutations;
};

/** Generic page metadata for a paged list. */
export type PageInfo = {
  __typename?: 'PageInfo';
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PagedAccounts = {
  __typename?: 'PagedAccounts';
  items: Array<Account>;
  pageInfo: PageInfo;
};

export type PagedBlogPosts = {
  __typename?: 'PagedBlogPosts';
  items: Array<BlogPost>;
  pageInfo: PageInfo;
};

export type PagedReaderComments = {
  __typename?: 'PagedReaderComments';
  items: Array<ReaderComment>;
  pageInfo: PageInfo;
};

export type PagedReaderTexts = {
  __typename?: 'PagedReaderTexts';
  items: Array<ReaderText>;
  pageInfo: PageInfo;
};

/** Generic pagination, sort, and filter input. */
export type PaginationInput = {
  filters?: InputMaybe<Array<FilterInput>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortDir?: InputMaybe<SortDirection>;
};

export type Query = {
  __typename?: 'Query';
  blogQueries: BlogQueries;
  gaiaQueries: GaiaQueries;
  hadesQueries: HadesQueries;
};

export type QueryResult = QuerySuccess | StandardError;

export type QuerySuccess = {
  __typename?: 'QuerySuccess';
  id?: Maybe<Scalars['ID']['output']>;
  message: Scalars['String']['output'];
};

export type ReaderAccount = {
  __typename?: 'ReaderAccount';
  avatar?: Maybe<Scalars['String']['output']>;
  cefrLevel?: Maybe<CefrLevel>;
  discordId: Scalars['String']['output'];
  discordUsername?: Maybe<Scalars['String']['output']>;
  gaiaAccountId: Scalars['ID']['output'];
  globalName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  roles: Array<ReaderRole>;
};

export type ReaderAnnotation = {
  __typename?: 'ReaderAnnotation';
  author?: Maybe<RemoteUser>;
  authorProfile?: Maybe<ReaderAccount>;
  body: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  downvotes: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  myVote?: Maybe<VoteValue>;
  netScore: Scalars['Int']['output'];
  position?: Maybe<ReaderPosition>;
  positionId: Scalars['ID']['output'];
  remoteObject?: Maybe<Array<Scalars['String']['output']>>;
  replyCount: Scalars['Int']['output'];
  status: ReaderStatus;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  upvotes: Scalars['Int']['output'];
};

export type ReaderComment = {
  __typename?: 'ReaderComment';
  annotationId: Scalars['ID']['output'];
  author?: Maybe<RemoteUser>;
  authorProfile?: Maybe<ReaderAccount>;
  body: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  downvotes: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  myVote?: Maybe<VoteValue>;
  netScore: Scalars['Int']['output'];
  parentId?: Maybe<Scalars['ID']['output']>;
  status: ReaderStatus;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  upvotes: Scalars['Int']['output'];
};

export type ReaderObjectReference = {
  __typename?: 'ReaderObjectReference';
  id: Scalars['ID']['output'];
  ownerId: Scalars['ID']['output'];
  ownerType: Scalars['String']['output'];
};

export type ReaderPosition = {
  __typename?: 'ReaderPosition';
  endOffset: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  startOffset: Scalars['Int']['output'];
  textId: Scalars['ID']['output'];
};

export type ReaderRole = {
  __typename?: 'ReaderRole';
  cefrLevel?: Maybe<CefrLevel>;
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type ReaderSource = {
  __typename?: 'ReaderSource';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export enum ReaderStatus {
  Active = 'ACTIVE',
  Hidden = 'HIDDEN'
}

export type ReaderText = {
  __typename?: 'ReaderText';
  content: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['String']['output'];
  language: Scalars['String']['output'];
  level: CefrLevel;
  ownerId?: Maybe<Scalars['ID']['output']>;
  sourceId?: Maybe<Scalars['ID']['output']>;
  status: ReaderTextStatus;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type ReaderTextInput = {
  content: Scalars['String']['input'];
  language: Scalars['String']['input'];
  level: CefrLevel;
  ownerId?: InputMaybe<Scalars['ID']['input']>;
  sourceId?: InputMaybe<Scalars['ID']['input']>;
  title: Scalars['String']['input'];
};

export enum ReaderTextStatus {
  Active = 'ACTIVE',
  Archived = 'ARCHIVED'
}

export enum ReaderVoteTarget {
  Annotation = 'ANNOTATION',
  Comment = 'COMMENT'
}

/** A user identity on a remote provider. */
export type RemoteUser = {
  __typename?: 'RemoteUser';
  id: Scalars['String']['output'];
  type: RemoteUserType;
};

export type RemoteUserInput = {
  id: Scalars['String']['input'];
  type: RemoteUserType;
};

export enum RemoteUserType {
  Discord = 'DISCORD'
}

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type StandardError = {
  __typename?: 'StandardError';
  message: Scalars['String']['output'];
};

/** Predicted CEFR level with confidence and contributing factors. */
export type TextLevelAssessment = {
  __typename?: 'TextLevelAssessment';
  confidence: Scalars['Float']['output'];
  factors: Array<ComplexityFactor>;
  level: CefrLevel;
  probabilities: Array<LevelProbability>;
};

export type VoteInput = {
  targetId: Scalars['ID']['input'];
  targetType: ReaderVoteTarget;
  value: VoteValue;
};

export enum VoteValue {
  Down = 'DOWN',
  Up = 'UP'
}

export type ListBlogPostsPagedQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type ListBlogPostsPagedQuery = { __typename?: 'Query', blogQueries: { __typename?: 'BlogQueries', listBlogPosts: { __typename?: 'PagedBlogPosts', items: Array<{ __typename?: 'BlogPost', id: string, title: string, content?: string | null, language?: string | null, type?: { __typename?: 'BlogPostType', id: string, name: string } | null }>, pageInfo: { __typename?: 'PageInfo', page: number, size: number, totalPages: number, totalCount: number, hasNextPage: boolean, hasPreviousPage: boolean } } } };

export type LocateBlogPostQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type LocateBlogPostQuery = { __typename?: 'Query', blogQueries: { __typename?: 'BlogQueries', locateBlogPost?: { __typename?: 'BlogPost', id: string, title: string, content?: string | null, language?: string | null, type?: { __typename?: 'BlogPostType', id: string, name: string } | null } | null } };

export type PropertySetQueryVariables = Exact<{
  ownerKey: Scalars['String']['input'];
  name: Scalars['String']['input'];
  entry?: InputMaybe<Scalars['String']['input']>;
}>;


export type PropertySetQuery = { __typename?: 'Query', gaiaQueries: { __typename?: 'GaiaQueries', propertySet?: any | null } };

export type ClassifyTextLevelQueryVariables = Exact<{
  text: Scalars['String']['input'];
}>;


export type ClassifyTextLevelQuery = { __typename?: 'Query', hadesQueries: { __typename?: 'HadesQueries', classifyTextLevel?: { __typename?: 'TextLevelAssessment', level: CefrLevel, confidence: number, probabilities: Array<{ __typename?: 'LevelProbability', level: CefrLevel, probability: number }>, factors: Array<{ __typename?: 'ComplexityFactor', name: string, value: number, direction: string, weight: number }> } | null } };

export type ListTextsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type ListTextsQuery = { __typename?: 'Query', hadesQueries: { __typename?: 'HadesQueries', texts: { __typename?: 'PagedReaderTexts', items: Array<{ __typename?: 'ReaderText', id: string, title: string, language: string, level: CefrLevel, ownerId?: string | null, sourceId?: string | null, status: ReaderTextStatus }>, pageInfo: { __typename?: 'PageInfo', page: number, size: number, totalPages: number, totalCount: number, hasNextPage: boolean, hasPreviousPage: boolean } } } };

export type LocateTextQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type LocateTextQuery = { __typename?: 'Query', hadesQueries: { __typename?: 'HadesQueries', text?: { __typename?: 'ReaderText', id: string, title: string, content: string, language: string, level: CefrLevel, ownerId?: string | null, sourceId?: string | null, status: ReaderTextStatus, createdAt?: any | null, updatedAt?: any | null } | null } };


export const ListBlogPostsPagedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listBlogPostsPaged"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blogQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listBlogPosts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListBlogPostsPagedQuery, ListBlogPostsPagedQueryVariables>;
export const LocateBlogPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"locateBlogPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blogQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locateBlogPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LocateBlogPostQuery, LocateBlogPostQueryVariables>;
export const PropertySetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"propertySet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ownerKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entry"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gaiaQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"propertySet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ownerKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ownerKey"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"entry"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entry"}}}]}]}}]}}]} as unknown as DocumentNode<PropertySetQuery, PropertySetQueryVariables>;
export const ClassifyTextLevelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"classifyTextLevel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hadesQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"classifyTextLevel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"probabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"probability"}}]}},{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ClassifyTextLevelQuery, ClassifyTextLevelQueryVariables>;
export const ListTextsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listTexts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hadesQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"texts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"sourceId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListTextsQuery, ListTextsQueryVariables>;
export const LocateTextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"locateText"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hadesQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"sourceId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<LocateTextQuery, LocateTextQueryVariables>;