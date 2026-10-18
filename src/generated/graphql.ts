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
  /** A slightly refined version of RFC-3339 compliant DateTime Scalar */
  DateTime: { input: any; output: any; }
  /** A JSON scalar */
  JSON: { input: any; output: any; }
  /** A 64-bit signed integer */
  Long: { input: any; output: any; }
  _FieldSet: { input: any; output: any; }
};

export type Account = {
  __typename?: 'Account';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  personId: Scalars['ID']['output'];
  provider?: Maybe<Scalars['String']['output']>;
  remoteUsers?: Maybe<Array<RemoteUser>>;
  status: AccountStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  username: Scalars['String']['output'];
};

export enum AccountStatus {
  Active = 'ACTIVE',
  Deactivated = 'DEACTIVATED',
  Pending = 'PENDING',
  Suspended = 'SUSPENDED'
}

export type AddCommentResponse = {
  __typename?: 'AddCommentResponse';
  comment: ReaderComment;
  message: Scalars['String']['output'];
};

/** Result of adding an item to a checklist entry. */
export type AddItemResponse = {
  __typename?: 'AddItemResponse';
  entry: ChecklistEntry;
  message: Scalars['String']['output'];
};

export type AddRemoteObjectResponse = {
  __typename?: 'AddRemoteObjectResponse';
  message: Scalars['String']['output'];
  post: BlogPost;
};

/** Result of adding an item to a checklist template. */
export type AddTemplateItemResponse = {
  __typename?: 'AddTemplateItemResponse';
  message: Scalars['String']['output'];
  template: ChecklistTemplate;
};

export type AddTorrentInput = {
  bucket: Scalars['String']['input'];
  magnet?: InputMaybe<Scalars['String']['input']>;
  path?: InputMaybe<Scalars['String']['input']>;
  torrentFileBase64?: InputMaybe<Scalars['String']['input']>;
};

/**  Response payload for the addTorrent mutation. */
export type AddTorrentResponse = {
  __typename?: 'AddTorrentResponse';
  job: TorrentJob;
  message: Scalars['String']['output'];
};

export type AnnotationInput = {
  body: Scalars['String']['input'];
  endOffset: Scalars['Int']['input'];
  startOffset: Scalars['Int']['input'];
  textId: Scalars['ID']['input'];
};

export type Answer = {
  __typename?: 'Answer';
  correct: Scalars['Boolean']['output'];
  correctAnswer: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  myAnswer: Scalars['String']['output'];
  questionId: Scalars['ID']['output'];
};

export type AnswerInput = {
  correct: Scalars['Boolean']['input'];
  correctAnswer: Scalars['String']['input'];
  myAnswer: Scalars['String']['input'];
};

export type ApiKey = {
  __typename?: 'ApiKey';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  enabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  keyPrefix: Scalars['String']['output'];
  lastUsedAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ApplyConfigurationResponse = {
  __typename?: 'ApplyConfigurationResponse';
  configuration: Configuration;
  message: Scalars['String']['output'];
};

/** Result of archiving a checklist entry. */
export type ArchiveChecklistResponse = {
  __typename?: 'ArchiveChecklistResponse';
  entry: ChecklistEntry;
  message: Scalars['String']['output'];
};

/** Result of archiving a checklist template. */
export type ArchiveTemplateResponse = {
  __typename?: 'ArchiveTemplateResponse';
  message: Scalars['String']['output'];
  template: ChecklistTemplate;
};

export type ArchiveTextResponse = {
  __typename?: 'ArchiveTextResponse';
  message: Scalars['String']['output'];
  text: ReaderText;
};

export type ArchiveThreadResponse = {
  __typename?: 'ArchiveThreadResponse';
  message: Scalars['String']['output'];
  thread: ForumThread;
};

/** Result of attaching a remote object to a checklist detail. */
export type AttachChecklistObjectResponse = {
  __typename?: 'AttachChecklistObjectResponse';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type AttachForumObjectResponse = {
  __typename?: 'AttachForumObjectResponse';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type AttachReaderObjectResponse = {
  __typename?: 'AttachReaderObjectResponse';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type AttachedText = {
  __typename?: 'AttachedText';
  id: Scalars['String']['output'];
  language: Scalars['String']['output'];
  level: Scalars['String']['output'];
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type AuthResult = {
  __typename?: 'AuthResult';
  accountId: Scalars['ID']['output'];
  personId: Scalars['ID']['output'];
  token: Scalars['String']['output'];
};

export type BlogDetail = {
  __typename?: 'BlogDetail';
  attachedTexts: Array<AttachedText>;
  galleryItems: Array<BlogGalleryItem>;
  linkedPosts: Array<BlogPost>;
  post: BlogPost;
  propertySet?: Maybe<BlogPropertySet>;
};

export type BlogGalleryItem = {
  __typename?: 'BlogGalleryItem';
  id: Scalars['ID']['output'];
  imagePath?: Maybe<Scalars['String']['output']>;
  remoteObject?: Maybe<Array<Scalars['String']['output']>>;
  title?: Maybe<Scalars['String']['output']>;
};

export type BlogMutations = {
  __typename?: 'BlogMutations';
  addRemoteObject: AddRemoteObjectResponse;
  createBlogPost: CreateBlogPostResponse;
  createBlogPostType: CreateBlogPostTypeResponse;
  createBlogWithProperties: CreateBlogWithPropertiesResponse;
  deleteBlogPost: DeleteBlogPostResponse;
  ingestBlogFromSource: IngestBlogFromSourceResponse;
  removeRemoteObject: RemoveRemoteObjectResponse;
  updateBlogPost: UpdateBlogPostResponse;
  updateBlogWithProperties: UpdateBlogWithPropertiesResponse;
};


export type BlogMutationsAddRemoteObjectArgs = {
  postId: Scalars['ID']['input'];
  target: Scalars['String']['input'];
};


export type BlogMutationsCreateBlogPostArgs = {
  input?: InputMaybe<BlogPostInput>;
  title: Scalars['String']['input'];
};


export type BlogMutationsCreateBlogPostTypeArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};


export type BlogMutationsCreateBlogWithPropertiesArgs = {
  input: BlogWithPropertiesInput;
};


export type BlogMutationsDeleteBlogPostArgs = {
  id: Scalars['ID']['input'];
};


export type BlogMutationsIngestBlogFromSourceArgs = {
  input: IngestBlogInput;
};


export type BlogMutationsRemoveRemoteObjectArgs = {
  postId: Scalars['ID']['input'];
  target: Scalars['String']['input'];
};


export type BlogMutationsUpdateBlogPostArgs = {
  id: Scalars['ID']['input'];
  input: BlogPostInput;
};


export type BlogMutationsUpdateBlogWithPropertiesArgs = {
  id: Scalars['ID']['input'];
  input: BlogWithPropertiesInput;
};

export type BlogPost = {
  __typename?: 'BlogPost';
  attachedTexts?: Maybe<Array<AttachedText>>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  language?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<BlogPost>;
  parentId?: Maybe<Scalars['ID']['output']>;
  remoteObject?: Maybe<Array<Scalars['String']['output']>>;
  tags?: Maybe<Array<Scalars['String']['output']>>;
  title: Scalars['String']['output'];
  type?: Maybe<BlogPostType>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type BlogPostInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
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

export type BlogPropertySet = {
  __typename?: 'BlogPropertySet';
  entryName: Scalars['String']['output'];
  schema?: Maybe<BlogPropertySetSchema>;
  values?: Maybe<Scalars['JSON']['output']>;
};

export type BlogPropertySetSchema = {
  __typename?: 'BlogPropertySetSchema';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  ownerKey?: Maybe<Scalars['String']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
};

export type BlogQueries = {
  __typename?: 'BlogQueries';
  blogDetail: BlogDetail;
  blogPostTypes: Array<BlogPostType>;
  children: PagedBlogPosts;
  listBlogPosts: PagedBlogPosts;
  listByRemoteObjects?: Maybe<Array<Maybe<BlogPost>>>;
  locateBlogPost?: Maybe<BlogPost>;
};


export type BlogQueriesBlogDetailArgs = {
  id: Scalars['ID']['input'];
};


export type BlogQueriesChildrenArgs = {
  pagination?: InputMaybe<PaginationInput>;
  parentId: Scalars['ID']['input'];
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

export type BlogWithPropertiesInput = {
  content: Scalars['String']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  propertySet?: InputMaybe<Scalars['JSON']['input']>;
  remoteObject?: InputMaybe<Array<Scalars['String']['input']>>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title: Scalars['String']['input'];
  typeId: Scalars['ID']['input'];
};

/**  Represents a storage bucket. */
export type Bucket = {
  __typename?: 'Bucket';
  created?: Maybe<Scalars['String']['output']>;
  globalAliases?: Maybe<Array<Scalars['String']['output']>>;
  id: Scalars['String']['output'];
  localAliases?: Maybe<Array<Scalars['String']['output']>>;
};

export type BucketKeyInput = {
  bucket: Scalars['String']['input'];
  key: Scalars['String']['input'];
};

export type BulkCreateQuestionsResponse = {
  __typename?: 'BulkCreateQuestionsResponse';
  message: Scalars['String']['output'];
  questions: Array<Question>;
};

/**  Response payload for the cancelTorrent mutation. */
export type CancelTorrentResponse = {
  __typename?: 'CancelTorrentResponse';
  job: TorrentJob;
  message: Scalars['String']['output'];
};

export enum CefrLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2'
}

export type ChangePasswordResponse = {
  __typename?: 'ChangePasswordResponse';
  message: Scalars['String']['output'];
};

/** A grouping for checklist items (e.g. chores, work, packing). */
export type ChecklistCategory = {
  __typename?: 'ChecklistCategory';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ChecklistCategoryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
};

/** Notes and remote-object links for an entry, template, or item. */
export type ChecklistDetail = {
  __typename?: 'ChecklistDetail';
  description?: Maybe<Scalars['String']['output']>;
  ownerId: Scalars['ID']['output'];
  remoteObject?: Maybe<Array<Scalars['String']['output']>>;
};

/** A dated checklist instance carrying a set of items with per-item status. */
export type ChecklistEntry = {
  __typename?: 'ChecklistEntry';
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  dueAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ChecklistEntryInput = {
  dueAt?: InputMaybe<Scalars['DateTime']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

/** An item linked to an entry, carrying its runtime status and ordering. */
export type ChecklistEntryItem = {
  __typename?: 'ChecklistEntryItem';
  entryId: Scalars['ID']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  itemId: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  position: Scalars['Int']['output'];
  status: ItemStatus;
};

/** A reusable checklist item definition, optionally grouped into a category. */
export type ChecklistItem = {
  __typename?: 'ChecklistItem';
  categoryId?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lifecycleStatus: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ChecklistItemInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  lifecycleStatus?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

/** Write operations for checklists. */
export type ChecklistMutations = {
  __typename?: 'ChecklistMutations';
  addItem: AddItemResponse;
  addTemplateItem: AddTemplateItemResponse;
  archiveChecklist: ArchiveChecklistResponse;
  archiveTemplate: ArchiveTemplateResponse;
  attachObject: AttachChecklistObjectResponse;
  completeChecklist: CompleteChecklistResponse;
  createCategory: CreateCategoryResponse;
  createChecklist: CreateChecklistResponse;
  createChecklistFromTemplate: CreateChecklistFromTemplateResponse;
  createChecklistFromTemplates: CreateChecklistFromTemplatesResponse;
  createItem: CreateItemResponse;
  createTemplate: CreateTemplateResponse;
  deleteChecklist: DeleteChecklistResponse;
  detachObject: DetachObjectResponse;
  removeItem: RemoveItemResponse;
  removeTemplateItem: RemoveTemplateItemResponse;
  retireItem: RetireItemResponse;
  saveCategory: SaveCategoryResponse;
  saveChecklist: SaveChecklistResponse;
  saveItem: SaveItemResponse;
  saveTemplate: SaveTemplateResponse;
  setItemStatus: SetItemStatusResponse;
};


/** Write operations for checklists. */
export type ChecklistMutationsAddItemArgs = {
  entryId: Scalars['ID']['input'];
  itemId: Scalars['ID']['input'];
  position?: InputMaybe<Scalars['Int']['input']>;
};


/** Write operations for checklists. */
export type ChecklistMutationsAddTemplateItemArgs = {
  itemId: Scalars['ID']['input'];
  position?: InputMaybe<Scalars['Int']['input']>;
  templateId: Scalars['ID']['input'];
};


/** Write operations for checklists. */
export type ChecklistMutationsArchiveChecklistArgs = {
  id: Scalars['ID']['input'];
};


/** Write operations for checklists. */
export type ChecklistMutationsArchiveTemplateArgs = {
  id: Scalars['ID']['input'];
};


/** Write operations for checklists. */
export type ChecklistMutationsAttachObjectArgs = {
  ownerType?: InputMaybe<RemoteObjectType>;
  source: Scalars['ID']['input'];
  target: Scalars['ID']['input'];
};


/** Write operations for checklists. */
export type ChecklistMutationsCompleteChecklistArgs = {
  id: Scalars['ID']['input'];
};


/** Write operations for checklists. */
export type ChecklistMutationsCreateCategoryArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};


/** Write operations for checklists. */
export type ChecklistMutationsCreateChecklistArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
};


/** Write operations for checklists. */
export type ChecklistMutationsCreateChecklistFromTemplateArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  templateId: Scalars['ID']['input'];
};


/** Write operations for checklists. */
export type ChecklistMutationsCreateChecklistFromTemplatesArgs = {
  name?: InputMaybe<Scalars['String']['input']>;
  templateIds: Array<Scalars['ID']['input']>;
};


/** Write operations for checklists. */
export type ChecklistMutationsCreateItemArgs = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  icon?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};


/** Write operations for checklists. */
export type ChecklistMutationsCreateTemplateArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  itemIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  name: Scalars['String']['input'];
};


/** Write operations for checklists. */
export type ChecklistMutationsDeleteChecklistArgs = {
  id: Scalars['ID']['input'];
};


/** Write operations for checklists. */
export type ChecklistMutationsDetachObjectArgs = {
  ownerType?: InputMaybe<RemoteObjectType>;
  source: Scalars['ID']['input'];
  target: Scalars['ID']['input'];
};


/** Write operations for checklists. */
export type ChecklistMutationsRemoveItemArgs = {
  entryId: Scalars['ID']['input'];
  itemId: Scalars['ID']['input'];
};


/** Write operations for checklists. */
export type ChecklistMutationsRemoveTemplateItemArgs = {
  itemId: Scalars['ID']['input'];
  templateId: Scalars['ID']['input'];
};


/** Write operations for checklists. */
export type ChecklistMutationsRetireItemArgs = {
  id: Scalars['ID']['input'];
};


/** Write operations for checklists. */
export type ChecklistMutationsSaveCategoryArgs = {
  input: ChecklistCategoryInput;
};


/** Write operations for checklists. */
export type ChecklistMutationsSaveChecklistArgs = {
  input: ChecklistEntryInput;
};


/** Write operations for checklists. */
export type ChecklistMutationsSaveItemArgs = {
  input: ChecklistItemInput;
};


/** Write operations for checklists. */
export type ChecklistMutationsSaveTemplateArgs = {
  input: ChecklistTemplateInput;
};


/** Write operations for checklists. */
export type ChecklistMutationsSetItemStatusArgs = {
  entryId: Scalars['ID']['input'];
  itemId: Scalars['ID']['input'];
  status: ItemStatus;
};

/** Read operations for checklists. */
export type ChecklistQueries = {
  __typename?: 'ChecklistQueries';
  entry?: Maybe<ChecklistEntry>;
  entryDetails?: Maybe<ChecklistDetail>;
  entryItems: PagedChecklistEntryItems;
  item?: Maybe<ChecklistItem>;
  itemDetails?: Maybe<ChecklistDetail>;
  items: PagedChecklistItems;
  listCategories?: Maybe<Array<ChecklistCategory>>;
  listEntries?: Maybe<Array<ChecklistEntry>>;
  listTemplates?: Maybe<Array<ChecklistTemplate>>;
  locateRemoteObjects: Array<RemoteObjectReference>;
  template?: Maybe<ChecklistTemplate>;
  templateDetails?: Maybe<ChecklistDetail>;
  templateItems: PagedChecklistTemplateItems;
};


/** Read operations for checklists. */
export type ChecklistQueriesEntryArgs = {
  id: Scalars['ID']['input'];
};


/** Read operations for checklists. */
export type ChecklistQueriesEntryDetailsArgs = {
  id: Scalars['ID']['input'];
};


/** Read operations for checklists. */
export type ChecklistQueriesEntryItemsArgs = {
  entryId: Scalars['ID']['input'];
  pagination?: InputMaybe<PaginationInput>;
};


/** Read operations for checklists. */
export type ChecklistQueriesItemArgs = {
  id: Scalars['ID']['input'];
};


/** Read operations for checklists. */
export type ChecklistQueriesItemDetailsArgs = {
  id: Scalars['ID']['input'];
};


/** Read operations for checklists. */
export type ChecklistQueriesItemsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


/** Read operations for checklists. */
export type ChecklistQueriesLocateRemoteObjectsArgs = {
  ids: Array<Scalars['String']['input']>;
};


/** Read operations for checklists. */
export type ChecklistQueriesTemplateArgs = {
  id: Scalars['ID']['input'];
};


/** Read operations for checklists. */
export type ChecklistQueriesTemplateDetailsArgs = {
  id: Scalars['ID']['input'];
};


/** Read operations for checklists. */
export type ChecklistQueriesTemplateItemsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  templateId: Scalars['ID']['input'];
};

/** A reusable set of items that can seed new checklist entries. */
export type ChecklistTemplate = {
  __typename?: 'ChecklistTemplate';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ChecklistTemplateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

/** An item linked to a template, carrying only its ordering position. */
export type ChecklistTemplateItem = {
  __typename?: 'ChecklistTemplateItem';
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  itemId: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  position: Scalars['Int']['output'];
  templateId: Scalars['ID']['output'];
};

export type CommentInput = {
  annotationId: Scalars['ID']['input'];
  body: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

/** Result of completing a checklist entry. */
export type CompleteChecklistResponse = {
  __typename?: 'CompleteChecklistResponse';
  entry: ChecklistEntry;
  message: Scalars['String']['output'];
};

/** A contributing complexity factor with a direction (up/down). */
export type ComplexityFactor = {
  __typename?: 'ComplexityFactor';
  direction: Scalars['String']['output'];
  name: Scalars['String']['output'];
  value: Scalars['Float']['output'];
  weight: Scalars['Float']['output'];
};

export type Configuration = {
  __typename?: 'Configuration';
  content: Scalars['JSON']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  lastAppliedAt?: Maybe<Scalars['DateTime']['output']>;
  lastApplyError?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ConfigurationInput = {
  content: Scalars['JSON']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
};

export type ConfirmAccountReactivationResponse = {
  __typename?: 'ConfirmAccountReactivationResponse';
  message: Scalars['String']['output'];
};

export type CreateAnnotationResponse = {
  __typename?: 'CreateAnnotationResponse';
  annotation: ReaderAnnotation;
  message: Scalars['String']['output'];
};

export type CreateBlogPostResponse = {
  __typename?: 'CreateBlogPostResponse';
  message: Scalars['String']['output'];
  post: BlogPost;
};

export type CreateBlogPostTypeResponse = {
  __typename?: 'CreateBlogPostTypeResponse';
  message: Scalars['String']['output'];
  type: BlogPostType;
};

export type CreateBlogWithPropertiesResponse = {
  __typename?: 'CreateBlogWithPropertiesResponse';
  message: Scalars['String']['output'];
  post: BlogPost;
};

/** Result of creating a checklist category. */
export type CreateCategoryResponse = {
  __typename?: 'CreateCategoryResponse';
  category: ChecklistCategory;
  message: Scalars['String']['output'];
};

/** Result of creating a checklist entry from a single template. */
export type CreateChecklistFromTemplateResponse = {
  __typename?: 'CreateChecklistFromTemplateResponse';
  entry: ChecklistEntry;
  message: Scalars['String']['output'];
};

/** Result of creating a checklist entry from multiple templates. */
export type CreateChecklistFromTemplatesResponse = {
  __typename?: 'CreateChecklistFromTemplatesResponse';
  entry: ChecklistEntry;
  message: Scalars['String']['output'];
};

/** Result of creating a checklist entry. */
export type CreateChecklistResponse = {
  __typename?: 'CreateChecklistResponse';
  entry: ChecklistEntry;
  message: Scalars['String']['output'];
};

export type CreateConfigurationResponse = {
  __typename?: 'CreateConfigurationResponse';
  configuration: Configuration;
  message: Scalars['String']['output'];
};

export type CreateGalleryItemResponse = {
  __typename?: 'CreateGalleryItemResponse';
  item: GalleryItem;
  message: Scalars['String']['output'];
};

export type CreateIpWhitelistEntryResponse = {
  __typename?: 'CreateIpWhitelistEntryResponse';
  entry: IpWhitelistEntry;
  message: Scalars['String']['output'];
};

/** Result of creating a checklist item. */
export type CreateItemResponse = {
  __typename?: 'CreateItemResponse';
  item: ChecklistItem;
  message: Scalars['String']['output'];
};

export type CreatePersonResponse = {
  __typename?: 'CreatePersonResponse';
  message: Scalars['String']['output'];
  person: Person;
};

export type CreatePlaceResponse = {
  __typename?: 'CreatePlaceResponse';
  message: Scalars['String']['output'];
  place: Place;
};

export type CreatePostInput = {
  body: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
  threadId: Scalars['ID']['input'];
};

export type CreatePostResponse = {
  __typename?: 'CreatePostResponse';
  message: Scalars['String']['output'];
  post: ForumPost;
};

export type CreatePrivateNoteResponse = {
  __typename?: 'CreatePrivateNoteResponse';
  message: Scalars['String']['output'];
  note: PrivateNote;
};

export type CreateRoleResponse = {
  __typename?: 'CreateRoleResponse';
  message: Scalars['String']['output'];
  role: Role;
};

export type CreateSourceResponse = {
  __typename?: 'CreateSourceResponse';
  message: Scalars['String']['output'];
  source: ReaderSource;
};

/** Result of creating a checklist template. */
export type CreateTemplateResponse = {
  __typename?: 'CreateTemplateResponse';
  message: Scalars['String']['output'];
  template: ChecklistTemplate;
};

export type CreateTextResponse = {
  __typename?: 'CreateTextResponse';
  message: Scalars['String']['output'];
  text: ReaderText;
};

export type CreateThreadInput = {
  remoteObject: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateThreadResponse = {
  __typename?: 'CreateThreadResponse';
  message: Scalars['String']['output'];
  thread: ForumThread;
};

export type DeactivateAccountResponse = {
  __typename?: 'DeactivateAccountResponse';
  message: Scalars['String']['output'];
};

export type DeleteAnnotationResponse = {
  __typename?: 'DeleteAnnotationResponse';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type DeleteBlogPostResponse = {
  __typename?: 'DeleteBlogPostResponse';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

/** Result of deleting a checklist entry. */
export type DeleteChecklistResponse = {
  __typename?: 'DeleteChecklistResponse';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type DeleteCommentResponse = {
  __typename?: 'DeleteCommentResponse';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type DeleteConfigurationResponse = {
  __typename?: 'DeleteConfigurationResponse';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

/**  Response payload for the deleteFile mutation. */
export type DeleteFileResponse = {
  __typename?: 'DeleteFileResponse';
  key: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type DeleteIpWhitelistEntryResponse = {
  __typename?: 'DeleteIpWhitelistEntryResponse';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

/**  Response payload for the deleteKey mutation. */
export type DeleteKeyResponse = {
  __typename?: 'DeleteKeyResponse';
  key: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type DeletePersonResponse = {
  __typename?: 'DeletePersonResponse';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type DeletePlaceResponse = {
  __typename?: 'DeletePlaceResponse';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type DeletePostResponse = {
  __typename?: 'DeletePostResponse';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type DeletePrivateNoteResponse = {
  __typename?: 'DeletePrivateNoteResponse';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type DeletePropertyEntryResponse = {
  __typename?: 'DeletePropertyEntryResponse';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type DeleteRoleResponse = {
  __typename?: 'DeleteRoleResponse';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

/** Result of detaching a remote object from a checklist detail. */
export type DetachObjectResponse = {
  __typename?: 'DetachObjectResponse';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export enum DeviceStatus {
  Active = 'ACTIVE',
  Expired = 'EXPIRED',
  Suspended = 'SUSPENDED'
}

export type DiscordLoginResult = {
  __typename?: 'DiscordLoginResult';
  accountId: Scalars['ID']['output'];
  readerAccountId: Scalars['ID']['output'];
  requiresReactivation: Scalars['Boolean']['output'];
  token: Scalars['String']['output'];
};

export type EditAnnotationResponse = {
  __typename?: 'EditAnnotationResponse';
  annotation: ReaderAnnotation;
  message: Scalars['String']['output'];
};

export type EditCommentResponse = {
  __typename?: 'EditCommentResponse';
  comment: ReaderComment;
  message: Scalars['String']['output'];
};

export type EditPostResponse = {
  __typename?: 'EditPostResponse';
  message: Scalars['String']['output'];
  post: ForumPost;
};

export type Entry = {
  __typename?: 'Entry';
  definitions: Array<Scalars['String']['output']>;
  sourceUrl?: Maybe<Scalars['String']['output']>;
  word: Scalars['String']['output'];
};

export enum EntryStatus {
  Active = 'ACTIVE',
  Archived = 'ARCHIVED'
}

export enum ErrorDetail {
  /**
   * The deadline expired before the operation could complete.
   *
   * For operations that change the state of the system, this error
   * may be returned even if the operation has completed successfully.
   * For example, a successful response from a server could have been
   * delayed long enough for the deadline to expire.
   *
   * HTTP Mapping: 504 Gateway Timeout
   * Error Type: UNAVAILABLE
   */
  DeadlineExceeded = 'DEADLINE_EXCEEDED',
  /**
   * The server detected that the client is exhibiting a behavior that
   * might be generating excessive load.
   *
   * HTTP Mapping: 420 Enhance Your Calm
   * Error Type: UNAVAILABLE
   */
  EnhanceYourCalm = 'ENHANCE_YOUR_CALM',
  /**
   * The requested field is not found in the schema.
   *
   * This differs from `NOT_FOUND` in that `NOT_FOUND` should be used when a
   * query is valid, but is unable to return a result (if, for example, a
   * specific video id doesn't exist). `FIELD_NOT_FOUND` is intended to be
   * returned by the server to signify that the requested field is not known to exist.
   * This may be returned in lieu of failing the entire query.
   * See also `PERMISSION_DENIED` for cases where the
   * requested field is invalid only for the given user or class of users.
   *
   * HTTP Mapping: 404 Not Found
   * Error Type: BAD_REQUEST
   */
  FieldNotFound = 'FIELD_NOT_FOUND',
  /**
   * The client specified an invalid argument.
   *
   * Note that this differs from `FAILED_PRECONDITION`.
   * `INVALID_ARGUMENT` indicates arguments that are problematic
   * regardless of the state of the system (e.g., a malformed file name).
   *
   * HTTP Mapping: 400 Bad Request
   * Error Type: BAD_REQUEST
   */
  InvalidArgument = 'INVALID_ARGUMENT',
  /**
   * The provided cursor is not valid.
   *
   * The most common usage for this error is when a client is paginating
   * through a list that uses stateful cursors. In that case, the provided
   * cursor may be expired.
   *
   * HTTP Mapping: 404 Not Found
   * Error Type: NOT_FOUND
   */
  InvalidCursor = 'INVALID_CURSOR',
  /**
   * Unable to perform operation because a required resource is missing.
   *
   * Example: Client is attempting to refresh a list, but the specified
   * list is expired. This requires an action by the client to get a new list.
   *
   * If the user is simply trying GET a resource that is not found,
   * use the NOT_FOUND error type. FAILED_PRECONDITION.MISSING_RESOURCE
   * is to be used particularly when the user is performing an operation
   * that requires a particular resource to exist.
   *
   * HTTP Mapping: 400 Bad Request or 500 Internal Server Error
   * Error Type: FAILED_PRECONDITION
   */
  MissingResource = 'MISSING_RESOURCE',
  /**
   * Service Error.
   *
   * There is a problem with an upstream service.
   *
   * This may be returned if a gateway receives an unknown error from a service
   * or if a service is unreachable.
   * If a request times out which waiting on a response from a service,
   * `DEADLINE_EXCEEDED` may be returned instead.
   * If a service returns a more specific error Type, the specific error Type may
   * be returned instead.
   *
   * HTTP Mapping: 502 Bad Gateway
   * Error Type: UNAVAILABLE
   */
  ServiceError = 'SERVICE_ERROR',
  /**
   * Request failed due to network errors.
   *
   * HTTP Mapping: 503 Unavailable
   * Error Type: UNAVAILABLE
   */
  TcpFailure = 'TCP_FAILURE',
  /**
   * Request throttled based on server concurrency limits.
   *
   * HTTP Mapping: 503 Unavailable
   * Error Type: UNAVAILABLE
   */
  ThrottledConcurrency = 'THROTTLED_CONCURRENCY',
  /**
   * Request throttled based on server CPU limits
   *
   * HTTP Mapping: 503 Unavailable.
   * Error Type: UNAVAILABLE
   */
  ThrottledCpu = 'THROTTLED_CPU',
  /**
   * The server detected that the client is exhibiting a behavior that
   * might be generating excessive load.
   *
   * HTTP Mapping: 429 Too Many Requests
   * Error Type: UNAVAILABLE
   */
  TooManyRequests = 'TOO_MANY_REQUESTS',
  /**
   * The operation is not implemented or is not currently supported/enabled.
   *
   * HTTP Mapping: 501 Not Implemented
   * Error Type: BAD_REQUEST
   */
  Unimplemented = 'UNIMPLEMENTED',
  /**
   * Unknown error.
   *
   * This error should only be returned when no other error detail applies.
   * If a client sees an unknown errorDetail, it will be interpreted as UNKNOWN.
   *
   * HTTP Mapping: 500 Internal Server Error
   */
  Unknown = 'UNKNOWN'
}

export enum ErrorType {
  /**
   * Bad Request.
   *
   * There is a problem with the request.
   * Retrying the same request is not likely to succeed.
   * An example would be a query or argument that cannot be deserialized.
   *
   * HTTP Mapping: 400 Bad Request
   */
  BadRequest = 'BAD_REQUEST',
  /**
   * The operation was rejected because the system is not in a state
   * required for the operation's execution.  For example, the directory
   * to be deleted is non-empty, an rmdir operation is applied to
   * a non-directory, etc.
   *
   * Service implementers can use the following guidelines to decide
   * between `FAILED_PRECONDITION` and `UNAVAILABLE`:
   *
   * - Use `UNAVAILABLE` if the client can retry just the failing call.
   * - Use `FAILED_PRECONDITION` if the client should not retry until
   * the system state has been explicitly fixed.  E.g., if an "rmdir"
   *      fails because the directory is non-empty, `FAILED_PRECONDITION`
   * should be returned since the client should not retry unless
   * the files are deleted from the directory.
   *
   * HTTP Mapping: 400 Bad Request or 500 Internal Server Error
   */
  FailedPrecondition = 'FAILED_PRECONDITION',
  /**
   * Internal error.
   *
   * An unexpected internal error was encountered. This means that some
   * invariants expected by the underlying system have been broken.
   * This error code is reserved for serious errors.
   *
   * HTTP Mapping: 500 Internal Server Error
   */
  Internal = 'INTERNAL',
  /**
   * The requested entity was not found.
   *
   * This could apply to a resource that has never existed (e.g. bad resource id),
   * or a resource that no longer exists (e.g. cache expired.)
   *
   * Note to server developers: if a request is denied for an entire class
   * of users, such as gradual feature rollout or undocumented allowlist,
   * `NOT_FOUND` may be used. If a request is denied for some users within
   * a class of users, such as user-based access control, `PERMISSION_DENIED`
   * must be used.
   *
   * HTTP Mapping: 404 Not Found
   */
  NotFound = 'NOT_FOUND',
  /**
   * The caller does not have permission to execute the specified
   * operation.
   *
   * `PERMISSION_DENIED` must not be used for rejections
   * caused by exhausting some resource or quota.
   * `PERMISSION_DENIED` must not be used if the caller
   * cannot be identified (use `UNAUTHENTICATED`
   * instead for those errors).
   *
   * This error Type does not imply the
   * request is valid or the requested entity exists or satisfies
   * other pre-conditions.
   *
   * HTTP Mapping: 403 Forbidden
   */
  PermissionDenied = 'PERMISSION_DENIED',
  /**
   * The request does not have valid authentication credentials.
   *
   * This is intended to be returned only for routes that require
   * authentication.
   *
   * HTTP Mapping: 401 Unauthorized
   */
  Unauthenticated = 'UNAUTHENTICATED',
  /**
   * Currently Unavailable.
   *
   * The service is currently unavailable.  This is most likely a
   * transient condition, which can be corrected by retrying with
   * a backoff.
   *
   * HTTP Mapping: 503 Unavailable
   */
  Unavailable = 'UNAVAILABLE',
  /**
   * Unknown error.
   *
   * For example, this error may be returned when
   * an error code received from another address space belongs to
   * an error space that is not known in this address space.  Also
   * errors raised by APIs that do not return enough error information
   * may be converted to this error.
   *
   * If a client sees an unknown errorType, it will be interpreted as UNKNOWN.
   * Unknown errors MUST NOT trigger any special behavior. These MAY be treated
   * by an implementation as being equivalent to INTERNAL.
   *
   * When possible, a more specific error should be provided.
   *
   * HTTP Mapping: 520 Unknown Error
   */
  Unknown = 'UNKNOWN'
}

export type ExpireTailscaleDeviceResponse = {
  __typename?: 'ExpireTailscaleDeviceResponse';
  device: TailscaleDevice;
  message: Scalars['String']['output'];
};

export type FatesMutations = {
  __typename?: 'FatesMutations';
  createPerson: CreatePersonResponse;
  createPlace: CreatePlaceResponse;
  deletePerson: DeletePersonResponse;
  deletePlace: DeletePlaceResponse;
  savePerson: SavePersonResponse;
  savePlace: SavePlaceResponse;
};


export type FatesMutationsCreatePersonArgs = {
  input: PersonInput;
};


export type FatesMutationsCreatePlaceArgs = {
  input: PlaceInput;
};


export type FatesMutationsDeletePersonArgs = {
  id: Scalars['ID']['input'];
};


export type FatesMutationsDeletePlaceArgs = {
  id: Scalars['ID']['input'];
};


export type FatesMutationsSavePersonArgs = {
  input: PersonInput;
};


export type FatesMutationsSavePlaceArgs = {
  input: PlaceInput;
};

export type FatesQueries = {
  __typename?: 'FatesQueries';
  listPeople?: Maybe<Array<Person>>;
  listPlaces?: Maybe<Array<Place>>;
  person?: Maybe<Person>;
  place?: Maybe<Place>;
};


export type FatesQueriesPersonArgs = {
  id: Scalars['ID']['input'];
};


export type FatesQueriesPlaceArgs = {
  id: Scalars['ID']['input'];
};

/**  Represents a file object in a bucket. */
export type File = {
  __typename?: 'File';
  key: Scalars['String']['output'];
  lastModified?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
};

/**  Mutations for filestore operations including multipart upload support. */
export type FilestoreMutations = {
  __typename?: 'FilestoreMutations';
  /**  Adds a torrent from a magnet link or base64-encoded .torrent file. */
  addTorrent: AddTorrentResponse;
  /**  Cancels a torrent download and clears its scratch files. */
  cancelTorrent: CancelTorrentResponse;
  /**  Delete a file. */
  deleteFile: DeleteFileResponse;
  /**  Delete a key and propagate: recursively delete the key, all sub-keys and files under it. */
  deleteKey: DeleteKeyResponse;
  /**  Returns a presigned GET URL for direct browser download. */
  getPresignedDownloadUrl: GetPresignedDownloadUrlResponse;
  /**  Returns a presigned PUT URL for direct browser-to-storage upload. */
  getPresignedUploadUrl: GetPresignedUploadUrlResponse;
  /**  Batch-presigns multiple PUT URLs for multi-file uploads. */
  getPresignedUploadUrls: GetPresignedUploadUrlsResponse;
  /**  Pauses a torrent download. */
  pauseTorrent: PauseTorrentResponse;
  /**  Create a directory key (folder). */
  putKey: PutKeyResponse;
  /**  Renames a single file or a directory prefix. Validates conflicts when merge is false. */
  renameKey: RenameKeyResponse;
  /**  Resumes a paused torrent download. */
  resumeTorrent: ResumeTorrentResponse;
};


/**  Mutations for filestore operations including multipart upload support. */
export type FilestoreMutationsAddTorrentArgs = {
  input: AddTorrentInput;
};


/**  Mutations for filestore operations including multipart upload support. */
export type FilestoreMutationsCancelTorrentArgs = {
  jobId: Scalars['String']['input'];
};


/**  Mutations for filestore operations including multipart upload support. */
export type FilestoreMutationsDeleteFileArgs = {
  input: BucketKeyInput;
};


/**  Mutations for filestore operations including multipart upload support. */
export type FilestoreMutationsDeleteKeyArgs = {
  input: BucketKeyInput;
};


/**  Mutations for filestore operations including multipart upload support. */
export type FilestoreMutationsGetPresignedDownloadUrlArgs = {
  input: BucketKeyInput;
};


/**  Mutations for filestore operations including multipart upload support. */
export type FilestoreMutationsGetPresignedUploadUrlArgs = {
  input: PresignInput;
};


/**  Mutations for filestore operations including multipart upload support. */
export type FilestoreMutationsGetPresignedUploadUrlsArgs = {
  input: Array<PresignInput>;
};


/**  Mutations for filestore operations including multipart upload support. */
export type FilestoreMutationsPauseTorrentArgs = {
  jobId: Scalars['String']['input'];
};


/**  Mutations for filestore operations including multipart upload support. */
export type FilestoreMutationsPutKeyArgs = {
  input: PutKeyInput;
};


/**  Mutations for filestore operations including multipart upload support. */
export type FilestoreMutationsRenameKeyArgs = {
  input: RenameKeyInput;
};


/**  Mutations for filestore operations including multipart upload support. */
export type FilestoreMutationsResumeTorrentArgs = {
  jobId: Scalars['String']['input'];
};

/**  Queries for filestore operations. */
export type FilestoreQueries = {
  __typename?: 'FilestoreQueries';
  health?: Maybe<Scalars['String']['output']>;
  listBuckets?: Maybe<Array<Bucket>>;
  /**  List all active image key details in a bucket. */
  listImages?: Maybe<Array<KeyDetail>>;
  /**  List keys under a prefix, returning objects and directory entries. */
  listKeys?: Maybe<Array<KeyEntry>>;
  /**  Locate a single key's metadata by bucket and key path. */
  locate?: Maybe<KeyDetail>;
  /**  Locate a single active image key detail by bucket and key path. */
  locateImage?: Maybe<KeyDetail>;
  /**  Searches Prowlarr for torrents matching the query. */
  searchTorrents: Array<TorrentSearchResult>;
  /**  Look up a single torrent download job by id. */
  torrentJob?: Maybe<TorrentJob>;
  /**  List torrent download jobs, optionally filtered by bucket and status. */
  torrentJobs?: Maybe<Array<TorrentJob>>;
};


/**  Queries for filestore operations. */
export type FilestoreQueriesListImagesArgs = {
  bucket: Scalars['String']['input'];
};


/**  Queries for filestore operations. */
export type FilestoreQueriesListKeysArgs = {
  bucket: Scalars['String']['input'];
  prefix?: InputMaybe<Scalars['String']['input']>;
};


/**  Queries for filestore operations. */
export type FilestoreQueriesLocateArgs = {
  bucket: Scalars['String']['input'];
  keyPath: Scalars['String']['input'];
};


/**  Queries for filestore operations. */
export type FilestoreQueriesLocateImageArgs = {
  bucket: Scalars['String']['input'];
  keyPath: Scalars['String']['input'];
};


/**  Queries for filestore operations. */
export type FilestoreQueriesSearchTorrentsArgs = {
  query: Scalars['String']['input'];
};


/**  Queries for filestore operations. */
export type FilestoreQueriesTorrentJobArgs = {
  jobId: Scalars['String']['input'];
};


/**  Queries for filestore operations. */
export type FilestoreQueriesTorrentJobsArgs = {
  bucket?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<TorrentJobStatus>;
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

export type ForumObjectReference = {
  __typename?: 'ForumObjectReference';
  id: Scalars['ID']['output'];
  ownerId: Scalars['ID']['output'];
  ownerType: Scalars['String']['output'];
};

/** A post in a discussion thread. */
export type ForumPost = {
  __typename?: 'ForumPost';
  author?: Maybe<RemoteUser>;
  authorProfile?: Maybe<ReaderAccount>;
  body: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  downvotes: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  myVote?: Maybe<VoteValue>;
  netScore: Scalars['Int']['output'];
  parentId?: Maybe<Scalars['ID']['output']>;
  status: PostStatus;
  threadId: Scalars['ID']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  upvotes: Scalars['Int']['output'];
};

/** A discussion thread attached to a remote object. */
export type ForumThread = {
  __typename?: 'ForumThread';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  remoteObject?: Maybe<Array<Scalars['String']['output']>>;
  status: ThreadStatus;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type ForumVoteInput = {
  postId: Scalars['ID']['input'];
  value: VoteValue;
};

export type GaiaMutations = {
  __typename?: 'GaiaMutations';
  applyConfiguration: ApplyConfigurationResponse;
  changePassword: ChangePasswordResponse;
  confirmAccountReactivation: ConfirmAccountReactivationResponse;
  createConfiguration: CreateConfigurationResponse;
  createIpWhitelistEntry: CreateIpWhitelistEntryResponse;
  createRole: CreateRoleResponse;
  deactivateAccount: DeactivateAccountResponse;
  deleteConfiguration: DeleteConfigurationResponse;
  deleteIpWhitelistEntry: DeleteIpWhitelistEntryResponse;
  deletePropertyEntry: DeletePropertyEntryResponse;
  deleteRole: DeleteRoleResponse;
  expireTailscaleDevice: ExpireTailscaleDeviceResponse;
  issueApiKey: IssueApiKeyResponse;
  login?: Maybe<AuthResult>;
  logout: LogoutResponse;
  register?: Maybe<AuthResult>;
  registerPropertySetSchema: RegisterPropertySetSchemaResponse;
  requestAccountReactivation: RequestAccountReactivationResponse;
  requestPasswordReset: RequestPasswordResetResponse;
  resetPassword: ResetPasswordResponse;
  revokeApiKey: RevokeApiKeyResponse;
  rotateApiKey: RotateApiKeyResponse;
  saveRegistry: SaveRegistryResponse;
  setAccountPermissions: SetAccountPermissionsResponse;
  setAccountRoles: SetAccountRolesResponse;
  setProperty: SetPropertyResponse;
  setRolePermissions: SetRolePermissionsResponse;
  suspendAccount: SuspendAccountResponse;
  unsuspendAccount: UnsuspendAccountResponse;
  updateConfiguration: UpdateConfigurationResponse;
  updateIpWhitelistEntry: UpdateIpWhitelistEntryResponse;
  upsertPropertyEntry: UpsertPropertyEntryResponse;
};


export type GaiaMutationsApplyConfigurationArgs = {
  id: Scalars['ID']['input'];
};


export type GaiaMutationsChangePasswordArgs = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type GaiaMutationsConfirmAccountReactivationArgs = {
  token: Scalars['String']['input'];
};


export type GaiaMutationsCreateConfigurationArgs = {
  input: ConfigurationInput;
};


export type GaiaMutationsCreateIpWhitelistEntryArgs = {
  input: IpWhitelistEntryInput;
};


export type GaiaMutationsCreateRoleArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};


export type GaiaMutationsDeleteConfigurationArgs = {
  id: Scalars['ID']['input'];
};


export type GaiaMutationsDeleteIpWhitelistEntryArgs = {
  id: Scalars['ID']['input'];
};


export type GaiaMutationsDeletePropertyEntryArgs = {
  entry: Scalars['String']['input'];
  name: Scalars['String']['input'];
  ownerKey: Scalars['String']['input'];
};


export type GaiaMutationsDeleteRoleArgs = {
  id: Scalars['ID']['input'];
};


export type GaiaMutationsExpireTailscaleDeviceArgs = {
  id: Scalars['ID']['input'];
};


export type GaiaMutationsIssueApiKeyArgs = {
  accountUsername: Scalars['String']['input'];
  name: Scalars['String']['input'];
};


export type GaiaMutationsLoginArgs = {
  input: LoginInput;
};


export type GaiaMutationsRegisterArgs = {
  input: RegisterInput;
};


export type GaiaMutationsRegisterPropertySetSchemaArgs = {
  input: PropertySetSchemaInput;
};


export type GaiaMutationsRequestAccountReactivationArgs = {
  email: Scalars['String']['input'];
  provider: Scalars['String']['input'];
};


export type GaiaMutationsRequestPasswordResetArgs = {
  email: Scalars['String']['input'];
};


export type GaiaMutationsResetPasswordArgs = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type GaiaMutationsRevokeApiKeyArgs = {
  id: Scalars['ID']['input'];
};


export type GaiaMutationsRotateApiKeyArgs = {
  id: Scalars['ID']['input'];
};


export type GaiaMutationsSaveRegistryArgs = {
  input: HubRegistryInput;
};


export type GaiaMutationsSetAccountPermissionsArgs = {
  accountId: Scalars['ID']['input'];
  permissions: Array<Scalars['String']['input']>;
};


export type GaiaMutationsSetAccountRolesArgs = {
  accountId: Scalars['ID']['input'];
  roleNames: Array<Scalars['String']['input']>;
};


export type GaiaMutationsSetPropertyArgs = {
  entry: Scalars['String']['input'];
  input: SetPropertyInput;
  name: Scalars['String']['input'];
  ownerKey: Scalars['String']['input'];
};


export type GaiaMutationsSetRolePermissionsArgs = {
  permissions: Array<Scalars['String']['input']>;
  roleId: Scalars['ID']['input'];
};


export type GaiaMutationsSuspendAccountArgs = {
  id: Scalars['ID']['input'];
};


export type GaiaMutationsUnsuspendAccountArgs = {
  id: Scalars['ID']['input'];
};


export type GaiaMutationsUpdateConfigurationArgs = {
  id: Scalars['ID']['input'];
  input: ConfigurationInput;
};


export type GaiaMutationsUpdateIpWhitelistEntryArgs = {
  id: Scalars['ID']['input'];
  input: IpWhitelistEntryInput;
};


export type GaiaMutationsUpsertPropertyEntryArgs = {
  entry: Scalars['String']['input'];
  input: UpsertPropertyEntryInput;
  name: Scalars['String']['input'];
  ownerKey: Scalars['String']['input'];
};

export type GaiaQueries = {
  __typename?: 'GaiaQueries';
  accessibleCommandIntents: Array<PropertySetEntry>;
  account?: Maybe<Account>;
  accountPermissions: Array<Scalars['String']['output']>;
  accountRoles: Array<Scalars['String']['output']>;
  accounts: PagedAccounts;
  allPermissions: Array<Scalars['String']['output']>;
  configuration?: Maybe<Configuration>;
  configurations: Array<Configuration>;
  effectivePermissions: Array<Scalars['String']['output']>;
  hubRegistry?: Maybe<HubRegistry>;
  ipWhitelistEntries: Array<IpWhitelistEntry>;
  listAccounts?: Maybe<Array<Account>>;
  me?: Maybe<Account>;
  myRoles: Array<Scalars['String']['output']>;
  propertySet?: Maybe<Scalars['JSON']['output']>;
  propertySetSchema?: Maybe<PropertySetSchema>;
  propertySetSchemas: Array<PropertySetSchema>;
  propertySets: Array<PropertySetEntry>;
  role?: Maybe<Role>;
  rolePermissions: Array<Scalars['String']['output']>;
  roles: Array<Role>;
  tailscaleDevice?: Maybe<TailscaleDevice>;
  tailscaleDevices: Array<TailscaleDevice>;
};


export type GaiaQueriesAccessibleCommandIntentsArgs = {
  ownerKey: Scalars['String']['input'];
  propertySet: Scalars['String']['input'];
  remoteUserId: Scalars['String']['input'];
  remoteUserType: RemoteUserType;
};


export type GaiaQueriesAccountArgs = {
  id: Scalars['ID']['input'];
};


export type GaiaQueriesAccountPermissionsArgs = {
  accountId: Scalars['ID']['input'];
};


export type GaiaQueriesAccountRolesArgs = {
  accountId: Scalars['ID']['input'];
};


export type GaiaQueriesAccountsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type GaiaQueriesConfigurationArgs = {
  id: Scalars['ID']['input'];
};


export type GaiaQueriesEffectivePermissionsArgs = {
  remoteUserId: Scalars['String']['input'];
  remoteUserType: RemoteUserType;
};


export type GaiaQueriesPropertySetArgs = {
  entry?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  ownerKey: Scalars['String']['input'];
};


export type GaiaQueriesPropertySetSchemaArgs = {
  name: Scalars['String']['input'];
  ownerKey: Scalars['String']['input'];
};


export type GaiaQueriesPropertySetSchemasArgs = {
  ownerKey?: InputMaybe<Scalars['String']['input']>;
};


export type GaiaQueriesPropertySetsArgs = {
  name: Scalars['String']['input'];
  ownerKey: Scalars['String']['input'];
};


export type GaiaQueriesRoleArgs = {
  id: Scalars['ID']['input'];
};


export type GaiaQueriesRolePermissionsArgs = {
  roleId: Scalars['ID']['input'];
};


export type GaiaQueriesTailscaleDeviceArgs = {
  id: Scalars['ID']['input'];
};

export type GalleryItem = {
  __typename?: 'GalleryItem';
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  imagePath?: Maybe<Scalars['String']['output']>;
  keyDetailId?: Maybe<Scalars['ID']['output']>;
  remoteObject?: Maybe<Array<Scalars['String']['output']>>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type GalleryItemInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  imagePath?: InputMaybe<Scalars['String']['input']>;
  keyDetailId?: InputMaybe<Scalars['ID']['input']>;
  remoteObject?: InputMaybe<Array<Scalars['String']['input']>>;
  title: Scalars['String']['input'];
};

export type GalleryMutations = {
  __typename?: 'GalleryMutations';
  create: CreateGalleryItemResponse;
};


export type GalleryMutationsCreateArgs = {
  input?: InputMaybe<GalleryItemInput>;
};

export type GalleryQueries = {
  __typename?: 'GalleryQueries';
  list?: Maybe<Array<Maybe<GalleryItem>>>;
  listByRemoteObjects?: Maybe<Array<Maybe<GalleryItem>>>;
  locate?: Maybe<GalleryItem>;
  locateGalleryItems?: Maybe<Array<Maybe<GalleryItem>>>;
};


export type GalleryQueriesListByRemoteObjectsArgs = {
  ids: Array<Scalars['String']['input']>;
};


export type GalleryQueriesLocateArgs = {
  id: Scalars['ID']['input'];
};


export type GalleryQueriesLocateGalleryItemsArgs = {
  ids: Array<Scalars['ID']['input']>;
};

/**  Response payload for the getPresignedDownloadUrl mutation. */
export type GetPresignedDownloadUrlResponse = {
  __typename?: 'GetPresignedDownloadUrlResponse';
  message: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

/**  Response payload for the getPresignedUploadUrl mutation. */
export type GetPresignedUploadUrlResponse = {
  __typename?: 'GetPresignedUploadUrlResponse';
  message: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

/**  Response payload for the getPresignedUploadUrls mutation. */
export type GetPresignedUploadUrlsResponse = {
  __typename?: 'GetPresignedUploadUrlsResponse';
  message: Scalars['String']['output'];
  urls: Array<Scalars['String']['output']>;
};

/** Write operations for the reader. */
export type HadesMutations = {
  __typename?: 'HadesMutations';
  addComment: AddCommentResponse;
  archiveText: ArchiveTextResponse;
  attachObject: AttachReaderObjectResponse;
  createAnnotation: CreateAnnotationResponse;
  createPrivateNote: CreatePrivateNoteResponse;
  createSource: CreateSourceResponse;
  createText: CreateTextResponse;
  deleteAnnotation: DeleteAnnotationResponse;
  deleteComment: DeleteCommentResponse;
  deletePrivateNote: DeletePrivateNoteResponse;
  discordLogin?: Maybe<DiscordLoginResult>;
  editAnnotation: EditAnnotationResponse;
  editComment: EditCommentResponse;
  markViewed: MarkViewedResponse;
  removeVote: VoteReaderResponse;
  shareNotes: ShareNotesResponse;
  vote: VoteReaderResponse;
};


/** Write operations for the reader. */
export type HadesMutationsAddCommentArgs = {
  input: CommentInput;
};


/** Write operations for the reader. */
export type HadesMutationsArchiveTextArgs = {
  id: Scalars['ID']['input'];
};


/** Write operations for the reader. */
export type HadesMutationsAttachObjectArgs = {
  source: Scalars['ID']['input'];
  target: Scalars['String']['input'];
};


/** Write operations for the reader. */
export type HadesMutationsCreateAnnotationArgs = {
  input: AnnotationInput;
};


/** Write operations for the reader. */
export type HadesMutationsCreatePrivateNoteArgs = {
  input: PrivateNoteInput;
};


/** Write operations for the reader. */
export type HadesMutationsCreateSourceArgs = {
  name: Scalars['String']['input'];
  url: Scalars['String']['input'];
};


/** Write operations for the reader. */
export type HadesMutationsCreateTextArgs = {
  input: ReaderTextInput;
};


/** Write operations for the reader. */
export type HadesMutationsDeleteAnnotationArgs = {
  id: Scalars['ID']['input'];
};


/** Write operations for the reader. */
export type HadesMutationsDeleteCommentArgs = {
  id: Scalars['ID']['input'];
};


/** Write operations for the reader. */
export type HadesMutationsDeletePrivateNoteArgs = {
  id: Scalars['ID']['input'];
};


/** Write operations for the reader. */
export type HadesMutationsDiscordLoginArgs = {
  code: Scalars['String']['input'];
  state: Scalars['String']['input'];
};


/** Write operations for the reader. */
export type HadesMutationsEditAnnotationArgs = {
  body: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


/** Write operations for the reader. */
export type HadesMutationsEditCommentArgs = {
  body: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


/** Write operations for the reader. */
export type HadesMutationsMarkViewedArgs = {
  textId: Scalars['ID']['input'];
};


/** Write operations for the reader. */
export type HadesMutationsRemoveVoteArgs = {
  targetId: Scalars['ID']['input'];
  targetType: ReaderVoteTarget;
};


/** Write operations for the reader. */
export type HadesMutationsShareNotesArgs = {
  input: ShareNotesInput;
};


/** Write operations for the reader. */
export type HadesMutationsVoteArgs = {
  input: VoteInput;
};

/** Read operations for the reader. */
export type HadesQueries = {
  __typename?: 'HadesQueries';
  annotation?: Maybe<ReaderAnnotation>;
  annotations: PagedReaderAnnotations;
  classifyTextLevel?: Maybe<TextLevelAssessment>;
  comments: PagedReaderComments;
  defineWord?: Maybe<Word>;
  locateReaderTexts: Array<ReaderText>;
  locateRemoteObjects: Array<ReaderObjectReference>;
  myVote?: Maybe<VoteValue>;
  privateNotes: PagedPrivateNotes;
  readerAccount?: Maybe<ReaderAccount>;
  readerAccounts: Array<ReaderAccount>;
  searchReaderAccounts: Array<ReaderAccount>;
  source?: Maybe<ReaderSource>;
  sources?: Maybe<Array<ReaderSource>>;
  text?: Maybe<ReaderText>;
  texts: PagedReaderTexts;
  viewedReaderTexts: PagedReaderTexts;
  viewedTexts: PagedTextViews;
};


/** Read operations for the reader. */
export type HadesQueriesAnnotationArgs = {
  id: Scalars['ID']['input'];
};


/** Read operations for the reader. */
export type HadesQueriesAnnotationsArgs = {
  includeHidden?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationInput>;
  textId: Scalars['ID']['input'];
};


/** Read operations for the reader. */
export type HadesQueriesClassifyTextLevelArgs = {
  text: Scalars['String']['input'];
};


/** Read operations for the reader. */
export type HadesQueriesCommentsArgs = {
  annotationId: Scalars['ID']['input'];
  includeHidden?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationInput>;
};


/** Read operations for the reader. */
export type HadesQueriesDefineWordArgs = {
  dictionary?: InputMaybe<WordDictionary>;
  scope?: InputMaybe<Array<WordScope>>;
  word: Scalars['String']['input'];
};


/** Read operations for the reader. */
export type HadesQueriesLocateReaderTextsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


/** Read operations for the reader. */
export type HadesQueriesLocateRemoteObjectsArgs = {
  ids: Array<Scalars['String']['input']>;
};


/** Read operations for the reader. */
export type HadesQueriesMyVoteArgs = {
  targetId: Scalars['ID']['input'];
  targetType: ReaderVoteTarget;
};


/** Read operations for the reader. */
export type HadesQueriesPrivateNotesArgs = {
  pagination?: InputMaybe<PaginationInput>;
  textId: Scalars['ID']['input'];
};


/** Read operations for the reader. */
export type HadesQueriesReaderAccountsArgs = {
  remoteUsers: Array<RemoteUserInput>;
};


/** Read operations for the reader. */
export type HadesQueriesSearchReaderAccountsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  query: Scalars['String']['input'];
};


/** Read operations for the reader. */
export type HadesQueriesSourceArgs = {
  id: Scalars['ID']['input'];
};


/** Read operations for the reader. */
export type HadesQueriesTextArgs = {
  id: Scalars['ID']['input'];
};


/** Read operations for the reader. */
export type HadesQueriesTextsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


/** Read operations for the reader. */
export type HadesQueriesViewedReaderTextsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


/** Read operations for the reader. */
export type HadesQueriesViewedTextsArgs = {
  pagination?: InputMaybe<PaginationInput>;
};

export type HubApp = {
  __typename?: 'HubApp';
  description: Scalars['String']['output'];
  devPort: Scalars['Int']['output'];
  dir: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  prodPort: Scalars['Int']['output'];
  self: Scalars['Boolean']['output'];
  url: Scalars['String']['output'];
};

export type HubAppInput = {
  description: Scalars['String']['input'];
  devPort: Scalars['Int']['input'];
  dir: Scalars['String']['input'];
  enabled: Scalars['Boolean']['input'];
  key: Scalars['String']['input'];
  name: Scalars['String']['input'];
  prodPort: Scalars['Int']['input'];
  self: Scalars['Boolean']['input'];
  url: Scalars['String']['input'];
};

export enum HubMode {
  Dev = 'dev',
  Serve = 'serve'
}

export type HubRegistry = {
  __typename?: 'HubRegistry';
  apps: Array<HubApp>;
  mode: HubMode;
};

export type HubRegistryInput = {
  apps: Array<HubAppInput>;
  mode: HubMode;
};

/** Write operations for forums. */
export type IcarusMutations = {
  __typename?: 'IcarusMutations';
  archiveThread: ArchiveThreadResponse;
  attachObject: AttachForumObjectResponse;
  createPost: CreatePostResponse;
  createThread: CreateThreadResponse;
  deletePost: DeletePostResponse;
  editPost: EditPostResponse;
  lockThread: LockThreadResponse;
  removeVote: RemoveVoteResponse;
  vote: VoteForumResponse;
};


/** Write operations for forums. */
export type IcarusMutationsArchiveThreadArgs = {
  id: Scalars['ID']['input'];
};


/** Write operations for forums. */
export type IcarusMutationsAttachObjectArgs = {
  source: Scalars['ID']['input'];
  target: Scalars['String']['input'];
};


/** Write operations for forums. */
export type IcarusMutationsCreatePostArgs = {
  input: CreatePostInput;
};


/** Write operations for forums. */
export type IcarusMutationsCreateThreadArgs = {
  input: CreateThreadInput;
};


/** Write operations for forums. */
export type IcarusMutationsDeletePostArgs = {
  id: Scalars['ID']['input'];
};


/** Write operations for forums. */
export type IcarusMutationsEditPostArgs = {
  body: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};


/** Write operations for forums. */
export type IcarusMutationsLockThreadArgs = {
  id: Scalars['ID']['input'];
};


/** Write operations for forums. */
export type IcarusMutationsRemoveVoteArgs = {
  postId: Scalars['ID']['input'];
};


/** Write operations for forums. */
export type IcarusMutationsVoteArgs = {
  input: ForumVoteInput;
};

/** Read operations for forums. */
export type IcarusQueries = {
  __typename?: 'IcarusQueries';
  locateRemoteObjects: Array<ForumObjectReference>;
  myVote?: Maybe<VoteValue>;
  posts: PagedForumPosts;
  thread?: Maybe<ForumThread>;
  threadsFor: PagedForumThreads;
};


/** Read operations for forums. */
export type IcarusQueriesLocateRemoteObjectsArgs = {
  ids: Array<Scalars['String']['input']>;
};


/** Read operations for forums. */
export type IcarusQueriesMyVoteArgs = {
  postId: Scalars['ID']['input'];
};


/** Read operations for forums. */
export type IcarusQueriesPostsArgs = {
  includeHidden?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationInput>;
  threadId: Scalars['ID']['input'];
};


/** Read operations for forums. */
export type IcarusQueriesThreadArgs = {
  id: Scalars['ID']['input'];
};


/** Read operations for forums. */
export type IcarusQueriesThreadsForArgs = {
  pagination?: InputMaybe<PaginationInput>;
  remoteObject: Scalars['String']['input'];
};

export type IngestBlogFromSourceResponse = {
  __typename?: 'IngestBlogFromSourceResponse';
  message: Scalars['String']['output'];
  post: BlogPost;
};

export type IngestBlogInput = {
  parentId?: InputMaybe<Scalars['ID']['input']>;
  sourceId: Scalars['String']['input'];
  sourceKind: SourceKind;
  title: Scalars['String']['input'];
  typeName: Scalars['String']['input'];
};

export type IpWhitelistEntry = {
  __typename?: 'IpWhitelistEntry';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  immutable: Scalars['Boolean']['output'];
  pattern: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type IpWhitelistEntryInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  immutable?: InputMaybe<Scalars['Boolean']['input']>;
  pattern: Scalars['String']['input'];
};

export type IssueApiKeyResponse = {
  __typename?: 'IssueApiKeyResponse';
  apiKey: IssuedApiKey;
  message: Scalars['String']['output'];
};

export type IssuedApiKey = {
  __typename?: 'IssuedApiKey';
  apiKey: ApiKey;
  plaintextKey: Scalars['String']['output'];
};

/** Status of an item within a checklist entry. */
export enum ItemStatus {
  Complete = 'COMPLETE',
  Failed = 'FAILED',
  NotNeeded = 'NOT_NEEDED',
  NotStarted = 'NOT_STARTED'
}

/**  Detailed metadata for a specific key. */
export type KeyDetail = {
  __typename?: 'KeyDetail';
  archivedAt?: Maybe<Scalars['String']['output']>;
  bucket: Scalars['String']['output'];
  contentType?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  keyPath: Scalars['String']['output'];
  lastUpdatedAt?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

/**  Directory-like entry for a bucket key. */
export type KeyEntry = {
  __typename?: 'KeyEntry';
  description?: Maybe<Scalars['String']['output']>;
  isDirectory: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  lastModified?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  /**  Present only when this key is an in-progress torrent download. */
  torrent?: Maybe<TorrentDownload>;
};

/** Predicted probability for a single CEFR level. */
export type LevelProbability = {
  __typename?: 'LevelProbability';
  level: CefrLevel;
  probability: Scalars['Float']['output'];
};

export type LinkQuestionResponse = {
  __typename?: 'LinkQuestionResponse';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type LockThreadResponse = {
  __typename?: 'LockThreadResponse';
  message: Scalars['String']['output'];
  thread: ForumThread;
};

export type LoginInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type LogoutResponse = {
  __typename?: 'LogoutResponse';
  message: Scalars['String']['output'];
};

/**  Torrent metadata captured when a job is added. */
export type MagnetDetail = {
  __typename?: 'MagnetDetail';
  comment?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  files?: Maybe<Array<TorrentFile>>;
  id: Scalars['String']['output'];
  infoHash: Scalars['String']['output'];
  infoHashVersion?: Maybe<Scalars['String']['output']>;
  isPrivate: Scalars['Boolean']['output'];
  pieceCount?: Maybe<Scalars['Int']['output']>;
  pieceLength?: Maybe<Scalars['Long']['output']>;
  sourceUri?: Maybe<Scalars['String']['output']>;
  totalSize: Scalars['Long']['output'];
  trackers?: Maybe<Array<Scalars['String']['output']>>;
};

export type MarkViewedResponse = {
  __typename?: 'MarkViewedResponse';
  message: Scalars['String']['output'];
  textId: Scalars['ID']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  blogMutations: BlogMutations;
  checklistMutations: ChecklistMutations;
  fatesMutations: FatesMutations;
  filestoreMutations: FilestoreMutations;
  gaiaMutations: GaiaMutations;
  galleryMutations: GalleryMutations;
  hadesMutations: HadesMutations;
  icarusMutations: IcarusMutations;
  questionMutations: QuestionMutations;
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

export type PagedAnswers = {
  __typename?: 'PagedAnswers';
  items: Array<Answer>;
  pageInfo: PageInfo;
};

export type PagedBlogPosts = {
  __typename?: 'PagedBlogPosts';
  items: Array<BlogPost>;
  pageInfo: PageInfo;
};

/** A page of items linked to an entry. */
export type PagedChecklistEntryItems = {
  __typename?: 'PagedChecklistEntryItems';
  items: Array<ChecklistEntryItem>;
  pageInfo: PageInfo;
};

/** A page of checklist items. */
export type PagedChecklistItems = {
  __typename?: 'PagedChecklistItems';
  items: Array<ChecklistItem>;
  pageInfo: PageInfo;
};

/** A page of items linked to a template. */
export type PagedChecklistTemplateItems = {
  __typename?: 'PagedChecklistTemplateItems';
  items: Array<ChecklistTemplateItem>;
  pageInfo: PageInfo;
};

export type PagedForumPosts = {
  __typename?: 'PagedForumPosts';
  items: Array<ForumPost>;
  pageInfo: PageInfo;
};

export type PagedForumThreads = {
  __typename?: 'PagedForumThreads';
  items: Array<ForumThread>;
  pageInfo: PageInfo;
};

export type PagedPrivateNotes = {
  __typename?: 'PagedPrivateNotes';
  items: Array<PrivateNote>;
  pageInfo: PageInfo;
};

export type PagedQuestions = {
  __typename?: 'PagedQuestions';
  items: Array<Question>;
  pageInfo: PageInfo;
};

export type PagedReaderAnnotations = {
  __typename?: 'PagedReaderAnnotations';
  items: Array<ReaderAnnotation>;
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

export type PagedTextViews = {
  __typename?: 'PagedTextViews';
  items: Array<TextView>;
  pageInfo: PageInfo;
};

/** Generic pagination, sort, and filter input. */
export type PaginationInput = {
  filters?: InputMaybe<Array<FilterInput>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortDir?: InputMaybe<SortDirection>;
  sorts?: InputMaybe<Array<SortInput>>;
};

/**  Response payload for the pauseTorrent mutation. */
export type PauseTorrentResponse = {
  __typename?: 'PauseTorrentResponse';
  job: TorrentJob;
  message: Scalars['String']['output'];
};

export type Person = {
  __typename?: 'Person';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  place?: Maybe<Place>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type PersonInput = {
  displayName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  lastName: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  placeId?: InputMaybe<Scalars['ID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Place = {
  __typename?: 'Place';
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  line1?: Maybe<Scalars['String']['output']>;
  line2?: Maybe<Scalars['String']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  region?: Maybe<Scalars['String']['output']>;
};

export type PlaceInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  line1?: InputMaybe<Scalars['String']['input']>;
  line2?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
};

export enum PostStatus {
  Active = 'ACTIVE',
  Deleted = 'DELETED',
  Hidden = 'HIDDEN'
}

/**  Input for a single presigned-upload request. */
export type PresignInput = {
  bucket: Scalars['String']['input'];
  contentType?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
};

/** A per-user private note anchored to a text range. */
export type PrivateNote = {
  __typename?: 'PrivateNote';
  author?: Maybe<RemoteUser>;
  authorProfile?: Maybe<ReaderAccount>;
  body: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  endOffset: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  remoteObject?: Maybe<Array<Scalars['String']['output']>>;
  startOffset: Scalars['Int']['output'];
  textId: Scalars['ID']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  visibility: PrivateNoteVisibility;
};

export type PrivateNoteInput = {
  body: Scalars['String']['input'];
  endOffset: Scalars['Int']['input'];
  startOffset: Scalars['Int']['input'];
  textId: Scalars['ID']['input'];
};

export enum PrivateNoteVisibility {
  Private = 'PRIVATE',
  Shared = 'SHARED'
}

export type PropertySetEntry = {
  __typename?: 'PropertySetEntry';
  configurable: Scalars['Boolean']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  entryName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  ownerKey: Scalars['String']['output'];
  propertySet: Scalars['String']['output'];
  status: EntryStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  values: Scalars['JSON']['output'];
};

export type PropertySetSchema = {
  __typename?: 'PropertySetSchema';
  configurable: Scalars['Boolean']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  ownerKey?: Maybe<Scalars['String']['output']>;
  properties: Scalars['JSON']['output'];
  status: EntryStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type PropertySetSchemaInput = {
  configurable?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  ownerKey?: InputMaybe<Scalars['String']['input']>;
  properties: Scalars['JSON']['input'];
};

export type PutKeyInput = {
  bucket: Scalars['String']['input'];
  key?: InputMaybe<Scalars['String']['input']>;
};

/**  Response payload for the putKey mutation. */
export type PutKeyResponse = {
  __typename?: 'PutKeyResponse';
  key: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  _service: _Service;
  blogQueries: BlogQueries;
  checklistQueries: ChecklistQueries;
  fatesQueries: FatesQueries;
  filestoreQueries: FilestoreQueries;
  gaiaQueries: GaiaQueries;
  galleryQueries: GalleryQueries;
  hadesQueries: HadesQueries;
  icarusQueries: IcarusQueries;
  questionQueries: QuestionQueries;
  stemPlayerQueries: StemPlayerQueries;
  viewerQueries: ViewerQueries;
  wikiQueries: WikiQueries;
};

export type Question = {
  __typename?: 'Question';
  answer: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  explanation?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  remoteObject: Array<Scalars['String']['output']>;
  stem: Scalars['String']['output'];
};

export type QuestionInput = {
  answer: Scalars['String']['input'];
  explanation?: InputMaybe<Scalars['String']['input']>;
  remoteObject?: InputMaybe<Array<Scalars['String']['input']>>;
  stem: Scalars['String']['input'];
};

export type QuestionMutations = {
  __typename?: 'QuestionMutations';
  bulkCreateQuestions: BulkCreateQuestionsResponse;
  linkQuestion: LinkQuestionResponse;
  submitAnswer: SubmitAnswerResponse;
};


export type QuestionMutationsBulkCreateQuestionsArgs = {
  inputs: Array<QuestionInput>;
};


export type QuestionMutationsLinkQuestionArgs = {
  questionId: Scalars['ID']['input'];
  target: Scalars['String']['input'];
};


export type QuestionMutationsSubmitAnswerArgs = {
  input: AnswerInput;
  questionId: Scalars['ID']['input'];
};

export type QuestionQueries = {
  __typename?: 'QuestionQueries';
  listAnswers: PagedAnswers;
  listQuestions: PagedQuestions;
  locateQuestion?: Maybe<Question>;
};


export type QuestionQueriesListAnswersArgs = {
  pagination?: InputMaybe<PaginationInput>;
  questionId: Scalars['ID']['input'];
};


export type QuestionQueriesListQuestionsArgs = {
  pagination?: InputMaybe<PaginationInput>;
  remoteObject?: InputMaybe<Scalars['String']['input']>;
};


export type QuestionQueriesLocateQuestionArgs = {
  id: Scalars['ID']['input'];
};

/** Reader-specific profile for a member. */
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

/** A markdown explanation a user wrote for a position. */
export type ReaderAnnotation = {
  __typename?: 'ReaderAnnotation';
  author?: Maybe<RemoteUser>;
  authorProfile?: Maybe<ReaderAccount>;
  body: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  downvotes: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  myVote?: Maybe<VoteValue>;
  netScore: Scalars['Int']['output'];
  position?: Maybe<ReaderPosition>;
  positionId: Scalars['ID']['output'];
  remoteObject?: Maybe<Array<Scalars['String']['output']>>;
  replyCount: Scalars['Int']['output'];
  status: ReaderStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  upvotes: Scalars['Int']['output'];
};

/** A threaded reply on an annotation. */
export type ReaderComment = {
  __typename?: 'ReaderComment';
  annotationId: Scalars['ID']['output'];
  author?: Maybe<RemoteUser>;
  authorProfile?: Maybe<ReaderAccount>;
  body: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  downvotes: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  myVote?: Maybe<VoteValue>;
  netScore: Scalars['Int']['output'];
  parentId?: Maybe<Scalars['ID']['output']>;
  status: ReaderStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  upvotes: Scalars['Int']['output'];
};

export type ReaderObjectReference = {
  __typename?: 'ReaderObjectReference';
  id: Scalars['ID']['output'];
  ownerId: Scalars['ID']['output'];
  ownerType: Scalars['String']['output'];
};

/** A character range on a text. */
export type ReaderPosition = {
  __typename?: 'ReaderPosition';
  endOffset: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  startOffset: Scalars['Int']['output'];
  textId: Scalars['ID']['output'];
};

/** A learner level granted by a Discord guild role. */
export type ReaderRole = {
  __typename?: 'ReaderRole';
  cefrLevel?: Maybe<CefrLevel>;
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

/** The website a reader text originated from. */
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

/** A foreign-language text that users annotate. */
export type ReaderText = {
  __typename?: 'ReaderText';
  content: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  language: Scalars['String']['output'];
  level: CefrLevel;
  ownerId?: Maybe<Scalars['ID']['output']>;
  sourceId?: Maybe<Scalars['ID']['output']>;
  status: ReaderTextStatus;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
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

export type RegisterInput = {
  displayName?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type RegisterPropertySetSchemaResponse = {
  __typename?: 'RegisterPropertySetSchemaResponse';
  message: Scalars['String']['output'];
  schema: PropertySetSchema;
};

export type RelatedTopic = {
  __typename?: 'RelatedTopic';
  extract?: Maybe<Scalars['String']['output']>;
  pageUrl: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

/**
 * A generic reference returned by locateRemoteObjects: which checklist detail
 * references a given foreign object.
 */
export type RemoteObjectReference = {
  __typename?: 'RemoteObjectReference';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  ownerId: Scalars['ID']['output'];
  ownerType: RemoteObjectType;
};

/** The kind of checklist entity that owns a detail. */
export enum RemoteObjectType {
  Entry = 'ENTRY',
  Item = 'ITEM',
  Template = 'TEMPLATE'
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

/** Result of removing an item from a checklist entry. */
export type RemoveItemResponse = {
  __typename?: 'RemoveItemResponse';
  entry: ChecklistEntry;
  message: Scalars['String']['output'];
};

export type RemoveRemoteObjectResponse = {
  __typename?: 'RemoveRemoteObjectResponse';
  message: Scalars['String']['output'];
  post: BlogPost;
};

/** Result of removing an item from a checklist template. */
export type RemoveTemplateItemResponse = {
  __typename?: 'RemoveTemplateItemResponse';
  message: Scalars['String']['output'];
  template: ChecklistTemplate;
};

export type RemoveVoteResponse = {
  __typename?: 'RemoveVoteResponse';
  message: Scalars['String']['output'];
  post: ForumPost;
};

export type RenameKeyInput = {
  bucket: Scalars['String']['input'];
  merge: Scalars['Boolean']['input'];
  sourceKey: Scalars['String']['input'];
  targetKey: Scalars['String']['input'];
};

/**  Response payload for the renameKey mutation. */
export type RenameKeyResponse = {
  __typename?: 'RenameKeyResponse';
  conflicts: Array<Scalars['String']['output']>;
  hasConflicts: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type RequestAccountReactivationResponse = {
  __typename?: 'RequestAccountReactivationResponse';
  message: Scalars['String']['output'];
};

export type RequestPasswordResetResponse = {
  __typename?: 'RequestPasswordResetResponse';
  message: Scalars['String']['output'];
};

export type ResetPasswordResponse = {
  __typename?: 'ResetPasswordResponse';
  message: Scalars['String']['output'];
};

/**  Response payload for the resumeTorrent mutation. */
export type ResumeTorrentResponse = {
  __typename?: 'ResumeTorrentResponse';
  job: TorrentJob;
  message: Scalars['String']['output'];
};

/** Result of retiring a checklist item. */
export type RetireItemResponse = {
  __typename?: 'RetireItemResponse';
  item: ChecklistItem;
  message: Scalars['String']['output'];
};

export type RevokeApiKeyResponse = {
  __typename?: 'RevokeApiKeyResponse';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type Role = {
  __typename?: 'Role';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type RotateApiKeyResponse = {
  __typename?: 'RotateApiKeyResponse';
  apiKey: IssuedApiKey;
  message: Scalars['String']['output'];
};

/** Result of saving a checklist category. */
export type SaveCategoryResponse = {
  __typename?: 'SaveCategoryResponse';
  category: ChecklistCategory;
  message: Scalars['String']['output'];
};

/** Result of saving a checklist entry. */
export type SaveChecklistResponse = {
  __typename?: 'SaveChecklistResponse';
  entry: ChecklistEntry;
  message: Scalars['String']['output'];
};

/** Result of saving a checklist item. */
export type SaveItemResponse = {
  __typename?: 'SaveItemResponse';
  item: ChecklistItem;
  message: Scalars['String']['output'];
};

export type SavePersonResponse = {
  __typename?: 'SavePersonResponse';
  message: Scalars['String']['output'];
  person: Person;
};

export type SavePlaceResponse = {
  __typename?: 'SavePlaceResponse';
  message: Scalars['String']['output'];
  place: Place;
};

export type SaveRegistryResponse = {
  __typename?: 'SaveRegistryResponse';
  message: Scalars['String']['output'];
  registry: HubRegistry;
};

/** Result of saving a checklist template. */
export type SaveTemplateResponse = {
  __typename?: 'SaveTemplateResponse';
  message: Scalars['String']['output'];
  template: ChecklistTemplate;
};

export type SetAccountPermissionsResponse = {
  __typename?: 'SetAccountPermissionsResponse';
  accountId: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  permissions: Array<Scalars['String']['output']>;
};

export type SetAccountRolesResponse = {
  __typename?: 'SetAccountRolesResponse';
  accountId: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  roles: Array<Scalars['String']['output']>;
};

/** Result of setting an item's status within a checklist entry. */
export type SetItemStatusResponse = {
  __typename?: 'SetItemStatusResponse';
  entry: ChecklistEntry;
  message: Scalars['String']['output'];
};

export type SetPropertyInput = {
  property: Scalars['String']['input'];
  value: Scalars['JSON']['input'];
};

export type SetPropertyResponse = {
  __typename?: 'SetPropertyResponse';
  entry: PropertySetEntry;
  message: Scalars['String']['output'];
};

export type SetRolePermissionsResponse = {
  __typename?: 'SetRolePermissionsResponse';
  message: Scalars['String']['output'];
  permissions: Array<Scalars['String']['output']>;
  roleId: Scalars['ID']['output'];
};

export type ShareInput = {
  objectId: Scalars['ID']['input'];
  objectType: Scalars['String']['input'];
  relation: Scalars['String']['input'];
  subjectId: Scalars['ID']['input'];
  subjectType: Scalars['String']['input'];
};

export type ShareNotesInput = {
  subjectEmails?: InputMaybe<Array<Scalars['String']['input']>>;
  subjectIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  textId: Scalars['ID']['input'];
};

export type ShareNotesResponse = {
  __typename?: 'ShareNotesResponse';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type Song = {
  __typename?: 'Song';
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  path: Scalars['String']['output'];
  stems?: Maybe<Array<Maybe<Stem>>>;
};

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type SortInput = {
  dir: SortDirection;
  field: Scalars['String']['input'];
};

export enum SourceKind {
  Wikipedia = 'WIKIPEDIA',
  Wiktionary = 'WIKTIONARY'
}

export type Stem = {
  __typename?: 'Stem';
  name?: Maybe<Scalars['String']['output']>;
  path: Scalars['String']['output'];
};

export type StemPlayerQueries = {
  __typename?: 'StemPlayerQueries';
  list?: Maybe<Array<Maybe<Song>>>;
  locate?: Maybe<Song>;
};


export type StemPlayerQueriesLocateArgs = {
  id: Scalars['ID']['input'];
};

export type SubmitAnswerResponse = {
  __typename?: 'SubmitAnswerResponse';
  answer: Answer;
  message: Scalars['String']['output'];
};

export type Summary = {
  __typename?: 'Summary';
  extract?: Maybe<Scalars['String']['output']>;
  pageUrl?: Maybe<Scalars['String']['output']>;
  thumbnailUrl?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type SuspendAccountResponse = {
  __typename?: 'SuspendAccountResponse';
  account: Account;
  message: Scalars['String']['output'];
};

export type TailscaleDevice = {
  __typename?: 'TailscaleDevice';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  expiredAt?: Maybe<Scalars['DateTime']['output']>;
  headscaleId: Scalars['Long']['output'];
  id: Scalars['ID']['output'];
  ipv4?: Maybe<Scalars['String']['output']>;
  lastSeen?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  online: Scalars['Boolean']['output'];
  status: DeviceStatus;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

/** Predicted CEFR level with confidence and contributing factors. */
export type TextLevelAssessment = {
  __typename?: 'TextLevelAssessment';
  confidence: Scalars['Float']['output'];
  factors: Array<ComplexityFactor>;
  level: CefrLevel;
  probabilities: Array<LevelProbability>;
};

/** A record that the current user has viewed a text. */
export type TextView = {
  __typename?: 'TextView';
  textId: Scalars['ID']['output'];
  viewedAt: Scalars['DateTime']['output'];
};

export enum ThreadStatus {
  Active = 'ACTIVE',
  Archived = 'ARCHIVED',
  Locked = 'LOCKED'
}

/**  The live download state attached to a key while a torrent is in progress. */
export type TorrentDownload = {
  __typename?: 'TorrentDownload';
  downloadRateBps?: Maybe<Scalars['Int']['output']>;
  downloadedBytes?: Maybe<Scalars['Long']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  etaSeconds?: Maybe<Scalars['Int']['output']>;
  jobId: Scalars['String']['output'];
  magnetDetailId?: Maybe<Scalars['String']['output']>;
  peersConnected?: Maybe<Scalars['Int']['output']>;
  progress: Scalars['Float']['output'];
  status: TorrentJobStatus;
  totalBytes?: Maybe<Scalars['Long']['output']>;
};

/**  A single file declared within a torrent. */
export type TorrentFile = {
  __typename?: 'TorrentFile';
  indexInTorrent: Scalars['Int']['output'];
  path: Scalars['String']['output'];
  size: Scalars['Long']['output'];
};

/**  A single torrent download job tracked in the database. */
export type TorrentJob = {
  __typename?: 'TorrentJob';
  bucket: Scalars['String']['output'];
  completedAt?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  downloadRateBps?: Maybe<Scalars['Int']['output']>;
  downloadedBytes: Scalars['Long']['output'];
  errorMessage?: Maybe<Scalars['String']['output']>;
  etaSeconds?: Maybe<Scalars['Long']['output']>;
  id: Scalars['String']['output'];
  infoHash: Scalars['String']['output'];
  magnetDetail?: Maybe<MagnetDetail>;
  peersConnected?: Maybe<Scalars['Int']['output']>;
  progress: Scalars['Float']['output'];
  seedsConnected?: Maybe<Scalars['Int']['output']>;
  sourceType: Scalars['String']['output'];
  status: TorrentJobStatus;
  targetKeyPath: Scalars['String']['output'];
  totalBytes: Scalars['Long']['output'];
  uploadRateBps?: Maybe<Scalars['Int']['output']>;
  uploadedBytes: Scalars['Long']['output'];
};

/**  Lifecycle state of a torrent download job. */
export enum TorrentJobStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Downloading = 'DOWNLOADING',
  Failed = 'FAILED',
  Metadata = 'METADATA',
  Paused = 'PAUSED',
  Queued = 'QUEUED',
  Transcoding = 'TRANSCODING',
  Uploading = 'UPLOADING'
}

/**  A torrent search result from Prowlarr. */
export type TorrentSearchResult = {
  __typename?: 'TorrentSearchResult';
  leechers: Scalars['Int']['output'];
  magnet: Scalars['String']['output'];
  name: Scalars['String']['output'];
  publishDate?: Maybe<Scalars['String']['output']>;
  seeders: Scalars['Int']['output'];
  size: Scalars['String']['output'];
  sizeBytes: Scalars['Long']['output'];
};

export type UnsuspendAccountResponse = {
  __typename?: 'UnsuspendAccountResponse';
  account: Account;
  message: Scalars['String']['output'];
};

export type UpdateBlogPostResponse = {
  __typename?: 'UpdateBlogPostResponse';
  message: Scalars['String']['output'];
  post: BlogPost;
};

export type UpdateBlogWithPropertiesResponse = {
  __typename?: 'UpdateBlogWithPropertiesResponse';
  message: Scalars['String']['output'];
  post: BlogPost;
};

export type UpdateConfigurationResponse = {
  __typename?: 'UpdateConfigurationResponse';
  configuration: Configuration;
  message: Scalars['String']['output'];
};

export type UpdateIpWhitelistEntryResponse = {
  __typename?: 'UpdateIpWhitelistEntryResponse';
  entry: IpWhitelistEntry;
  message: Scalars['String']['output'];
};

export type UpsertPropertyEntryInput = {
  values: Scalars['JSON']['input'];
};

export type UpsertPropertyEntryResponse = {
  __typename?: 'UpsertPropertyEntryResponse';
  entry: PropertySetEntry;
  message: Scalars['String']['output'];
};

/** Read operations for the viewer. */
export type ViewerQueries = {
  __typename?: 'ViewerQueries';
  vncCredentials: VncCredentials;
};

/** Credentials the browser viewer needs to connect to the desktop. */
export type VncCredentials = {
  __typename?: 'VncCredentials';
  iframeSrc: Scalars['String']['output'];
};

export type VoteForumResponse = {
  __typename?: 'VoteForumResponse';
  message: Scalars['String']['output'];
  post: ForumPost;
};

export type VoteInput = {
  targetId: Scalars['ID']['input'];
  targetType: ReaderVoteTarget;
  value: VoteValue;
};

export type VoteReaderResponse = {
  __typename?: 'VoteReaderResponse';
  annotation?: Maybe<ReaderAnnotation>;
  comment?: Maybe<ReaderComment>;
  message: Scalars['String']['output'];
};

export enum VoteValue {
  Down = 'DOWN',
  Up = 'UP'
}

export type WikiQueries = {
  __typename?: 'WikiQueries';
  wikipediaPage?: Maybe<Scalars['String']['output']>;
  wikipediaRelatedTopics: Array<RelatedTopic>;
  wikipediaSearch: Array<Summary>;
  wikipediaSummary?: Maybe<Summary>;
  wiktionaryEntry?: Maybe<Entry>;
};


export type WikiQueriesWikipediaPageArgs = {
  title: Scalars['String']['input'];
};


export type WikiQueriesWikipediaRelatedTopicsArgs = {
  title: Scalars['String']['input'];
};


export type WikiQueriesWikipediaSearchArgs = {
  query: Scalars['String']['input'];
};


export type WikiQueriesWikipediaSummaryArgs = {
  title: Scalars['String']['input'];
};


export type WikiQueriesWiktionaryEntryArgs = {
  word: Scalars['String']['input'];
};

/** A dictionary word with its translations, compounds, and related words. */
export type Word = {
  __typename?: 'Word';
  compounds: Array<WordEntry>;
  entries: Array<WordEntry>;
  id: Scalars['ID']['output'];
  relatedWords: Array<Word>;
  sourceUrl: Scalars['String']['output'];
  term: Scalars['String']['output'];
  wordType?: Maybe<Scalars['String']['output']>;
};

/** Which WordReference dictionary to query. */
export enum WordDictionary {
  English = 'ENGLISH',
  GreekEnglish = 'GREEK_ENGLISH'
}

/** A single dictionary entry for a headword. */
export type WordEntry = {
  __typename?: 'WordEntry';
  examples: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  note?: Maybe<Scalars['String']['output']>;
  sense?: Maybe<Scalars['String']['output']>;
  term: Scalars['String']['output'];
  translations: Array<WordTranslation>;
  wordType: Scalars['String']['output'];
};

/** Which parts of a WordReference word page to include. */
export enum WordScope {
  AllTranslations = 'ALL_TRANSLATIONS',
  Compounds = 'COMPOUNDS',
  Examples = 'EXAMPLES',
  RelatedWords = 'RELATED_WORDS'
}

/** A translated term under a word entry. */
export type WordTranslation = {
  __typename?: 'WordTranslation';
  term: Scalars['String']['output'];
  usageNotes: Array<Scalars['String']['output']>;
  wordType?: Maybe<Scalars['String']['output']>;
};

export type _Service = {
  __typename?: '_Service';
  sdl: Scalars['String']['output'];
};

export type ListBlogPostsPagedQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type ListBlogPostsPagedQuery = { __typename?: 'Query', blogQueries: { __typename?: 'BlogQueries', listBlogPosts: { __typename?: 'PagedBlogPosts', items: Array<{ __typename?: 'BlogPost', id: string, title: string, content?: string | null, language?: string | null, type?: { __typename?: 'BlogPostType', id: string, name: string } | null }>, pageInfo: { __typename?: 'PageInfo', page: number, size: number, totalPages: number, totalCount: number, hasNextPage: boolean, hasPreviousPage: boolean } } } };

export type ListBlogPostsByRemoteObjectsQueryVariables = Exact<{
  ids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ListBlogPostsByRemoteObjectsQuery = { __typename?: 'Query', blogQueries: { __typename?: 'BlogQueries', listByRemoteObjects?: Array<{ __typename?: 'BlogPost', id: string, title: string, content?: string | null, language?: string | null, type?: { __typename?: 'BlogPostType', id: string, name: string } | null } | null> | null } };

export type LocateBlogPostQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type LocateBlogPostQuery = { __typename?: 'Query', blogQueries: { __typename?: 'BlogQueries', locateBlogPost?: { __typename?: 'BlogPost', id: string, title: string, content?: string | null, language?: string | null, type?: { __typename?: 'BlogPostType', id: string, name: string } | null } | null } };

export type AccessibleCommandIntentsQueryVariables = Exact<{
  remoteUserType: RemoteUserType;
  remoteUserId: Scalars['String']['input'];
  ownerKey: Scalars['String']['input'];
  propertySet: Scalars['String']['input'];
}>;


export type AccessibleCommandIntentsQuery = { __typename?: 'Query', gaiaQueries: { __typename?: 'GaiaQueries', accessibleCommandIntents: Array<{ __typename?: 'PropertySetEntry', entryName: string, values: any }> } };

export type EffectivePermissionsQueryVariables = Exact<{
  remoteUserType: RemoteUserType;
  remoteUserId: Scalars['String']['input'];
}>;


export type EffectivePermissionsQuery = { __typename?: 'Query', gaiaQueries: { __typename?: 'GaiaQueries', effectivePermissions: Array<string> } };

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

export type DefineWordQueryVariables = Exact<{
  word: Scalars['String']['input'];
  scope?: InputMaybe<Array<WordScope> | WordScope>;
}>;


export type DefineWordQuery = { __typename?: 'Query', hadesQueries: { __typename?: 'HadesQueries', defineWord?: { __typename?: 'Word', id: string, term: string, wordType?: string | null, sourceUrl: string, entries: Array<{ __typename?: 'WordEntry', id: string, term: string, wordType: string, sense?: string | null, examples: Array<string>, note?: string | null, translations: Array<{ __typename?: 'WordTranslation', term: string, wordType?: string | null, usageNotes: Array<string> }> }>, compounds: Array<{ __typename?: 'WordEntry', id: string, term: string, wordType: string, sense?: string | null, examples: Array<string>, note?: string | null, translations: Array<{ __typename?: 'WordTranslation', term: string, wordType?: string | null, usageNotes: Array<string> }> }>, relatedWords: Array<{ __typename?: 'Word', id: string, term: string, sourceUrl: string }> } | null } };

export type ListAnnotationsQueryVariables = Exact<{
  textId: Scalars['ID']['input'];
  includeHidden?: InputMaybe<Scalars['Boolean']['input']>;
  pagination?: InputMaybe<PaginationInput>;
}>;


export type ListAnnotationsQuery = { __typename?: 'Query', hadesQueries: { __typename?: 'HadesQueries', annotations: { __typename?: 'PagedReaderAnnotations', items: Array<{ __typename?: 'ReaderAnnotation', id: string, body: string, upvotes: number, downvotes: number, netScore: number, replyCount: number, createdAt?: any | null, updatedAt?: any | null, author?: { __typename?: 'RemoteUser', type: RemoteUserType, id: string } | null, authorProfile?: { __typename?: 'ReaderAccount', discordUsername?: string | null, globalName?: string | null } | null }>, pageInfo: { __typename?: 'PageInfo', page: number, size: number, totalPages: number, totalCount: number, hasNextPage: boolean, hasPreviousPage: boolean } } } };

export type ListTextsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
}>;


export type ListTextsQuery = { __typename?: 'Query', hadesQueries: { __typename?: 'HadesQueries', texts: { __typename?: 'PagedReaderTexts', items: Array<{ __typename?: 'ReaderText', id: string, title: string, language: string, level: CefrLevel, ownerId?: string | null, sourceId?: string | null, status: ReaderTextStatus }>, pageInfo: { __typename?: 'PageInfo', page: number, size: number, totalPages: number, totalCount: number, hasNextPage: boolean, hasPreviousPage: boolean } } } };

export type LocateAnnotationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type LocateAnnotationQuery = { __typename?: 'Query', hadesQueries: { __typename?: 'HadesQueries', annotation?: { __typename?: 'ReaderAnnotation', id: string, body: string, upvotes: number, downvotes: number, netScore: number, replyCount: number, createdAt?: any | null, updatedAt?: any | null, author?: { __typename?: 'RemoteUser', type: RemoteUserType, id: string } | null, authorProfile?: { __typename?: 'ReaderAccount', discordUsername?: string | null, globalName?: string | null } | null } | null } };

export type LocateTextQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type LocateTextQuery = { __typename?: 'Query', hadesQueries: { __typename?: 'HadesQueries', text?: { __typename?: 'ReaderText', id: string, title: string, content: string, language: string, level: CefrLevel, ownerId?: string | null, sourceId?: string | null, status: ReaderTextStatus, createdAt?: any | null, updatedAt?: any | null } | null } };


export const ListBlogPostsPagedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listBlogPostsPaged"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blogQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listBlogPosts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListBlogPostsPagedQuery, ListBlogPostsPagedQueryVariables>;
export const ListBlogPostsByRemoteObjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listBlogPostsByRemoteObjects"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blogQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listByRemoteObjects"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListBlogPostsByRemoteObjectsQuery, ListBlogPostsByRemoteObjectsQueryVariables>;
export const LocateBlogPostDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"locateBlogPost"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blogQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locateBlogPost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LocateBlogPostQuery, LocateBlogPostQueryVariables>;
export const AccessibleCommandIntentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"accessibleCommandIntents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"remoteUserType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoteUserType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"remoteUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ownerKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"propertySet"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gaiaQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessibleCommandIntents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"remoteUserType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"remoteUserType"}}},{"kind":"Argument","name":{"kind":"Name","value":"remoteUserId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"remoteUserId"}}},{"kind":"Argument","name":{"kind":"Name","value":"ownerKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ownerKey"}}},{"kind":"Argument","name":{"kind":"Name","value":"propertySet"},"value":{"kind":"Variable","name":{"kind":"Name","value":"propertySet"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"entryName"}},{"kind":"Field","name":{"kind":"Name","value":"values"}}]}}]}}]}}]} as unknown as DocumentNode<AccessibleCommandIntentsQuery, AccessibleCommandIntentsQueryVariables>;
export const EffectivePermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"effectivePermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"remoteUserType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoteUserType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"remoteUserId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gaiaQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"effectivePermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"remoteUserType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"remoteUserType"}}},{"kind":"Argument","name":{"kind":"Name","value":"remoteUserId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"remoteUserId"}}}]}]}}]}}]} as unknown as DocumentNode<EffectivePermissionsQuery, EffectivePermissionsQueryVariables>;
export const PropertySetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"propertySet"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ownerKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entry"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gaiaQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"propertySet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ownerKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ownerKey"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"entry"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entry"}}}]}]}}]}}]} as unknown as DocumentNode<PropertySetQuery, PropertySetQueryVariables>;
export const ClassifyTextLevelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"classifyTextLevel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hadesQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"classifyTextLevel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"probabilities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"probability"}}]}},{"kind":"Field","name":{"kind":"Name","value":"factors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}},{"kind":"Field","name":{"kind":"Name","value":"weight"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ClassifyTextLevelQuery, ClassifyTextLevelQueryVariables>;
export const DefineWordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"defineWord"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"word"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scope"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WordScope"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hadesQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"defineWord"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"word"},"value":{"kind":"Variable","name":{"kind":"Name","value":"word"}}},{"kind":"Argument","name":{"kind":"Name","value":"scope"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scope"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"term"}},{"kind":"Field","name":{"kind":"Name","value":"wordType"}},{"kind":"Field","name":{"kind":"Name","value":"entries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"term"}},{"kind":"Field","name":{"kind":"Name","value":"wordType"}},{"kind":"Field","name":{"kind":"Name","value":"sense"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"term"}},{"kind":"Field","name":{"kind":"Name","value":"wordType"}},{"kind":"Field","name":{"kind":"Name","value":"usageNotes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"examples"}},{"kind":"Field","name":{"kind":"Name","value":"note"}}]}},{"kind":"Field","name":{"kind":"Name","value":"compounds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"term"}},{"kind":"Field","name":{"kind":"Name","value":"wordType"}},{"kind":"Field","name":{"kind":"Name","value":"sense"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"term"}},{"kind":"Field","name":{"kind":"Name","value":"wordType"}},{"kind":"Field","name":{"kind":"Name","value":"usageNotes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"examples"}},{"kind":"Field","name":{"kind":"Name","value":"note"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relatedWords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"term"}},{"kind":"Field","name":{"kind":"Name","value":"sourceUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sourceUrl"}}]}}]}}]}}]} as unknown as DocumentNode<DefineWordQuery, DefineWordQueryVariables>;
export const ListAnnotationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listAnnotations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"textId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeHidden"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hadesQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"annotations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"textId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"textId"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeHidden"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeHidden"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"upvotes"}},{"kind":"Field","name":{"kind":"Name","value":"downvotes"}},{"kind":"Field","name":{"kind":"Name","value":"netScore"}},{"kind":"Field","name":{"kind":"Name","value":"replyCount"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"authorProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"discordUsername"}},{"kind":"Field","name":{"kind":"Name","value":"globalName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListAnnotationsQuery, ListAnnotationsQueryVariables>;
export const ListTextsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listTexts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hadesQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"texts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"sourceId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListTextsQuery, ListTextsQueryVariables>;
export const LocateAnnotationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"locateAnnotation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hadesQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"annotation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"upvotes"}},{"kind":"Field","name":{"kind":"Name","value":"downvotes"}},{"kind":"Field","name":{"kind":"Name","value":"netScore"}},{"kind":"Field","name":{"kind":"Name","value":"replyCount"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"authorProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"discordUsername"}},{"kind":"Field","name":{"kind":"Name","value":"globalName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<LocateAnnotationQuery, LocateAnnotationQueryVariables>;
export const LocateTextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"locateText"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hadesQueries"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"text"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"level"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"sourceId"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<LocateTextQuery, LocateTextQueryVariables>;