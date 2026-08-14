export var AccountStatus;
(function (AccountStatus) {
    AccountStatus["Active"] = "ACTIVE";
    AccountStatus["Deactivated"] = "DEACTIVATED";
    AccountStatus["Pending"] = "PENDING";
    AccountStatus["Suspended"] = "SUSPENDED";
})(AccountStatus || (AccountStatus = {}));
export var CefrLevel;
(function (CefrLevel) {
    CefrLevel["A1"] = "A1";
    CefrLevel["A2"] = "A2";
    CefrLevel["B1"] = "B1";
    CefrLevel["B2"] = "B2";
    CefrLevel["C1"] = "C1";
    CefrLevel["C2"] = "C2";
})(CefrLevel || (CefrLevel = {}));
/** Operators for FilterInput. */
export var FilterOperator;
(function (FilterOperator) {
    FilterOperator["EndsWith"] = "ENDS_WITH";
    FilterOperator["Equals"] = "EQUALS";
    FilterOperator["GreaterThan"] = "GREATER_THAN";
    FilterOperator["GreaterThanOrEqual"] = "GREATER_THAN_OR_EQUAL";
    FilterOperator["In"] = "IN";
    FilterOperator["LessThan"] = "LESS_THAN";
    FilterOperator["LessThanOrEqual"] = "LESS_THAN_OR_EQUAL";
    FilterOperator["Matches"] = "MATCHES";
    FilterOperator["NotEquals"] = "NOT_EQUALS";
    FilterOperator["StartsWith"] = "STARTS_WITH";
})(FilterOperator || (FilterOperator = {}));
export var ReaderStatus;
(function (ReaderStatus) {
    ReaderStatus["Active"] = "ACTIVE";
    ReaderStatus["Hidden"] = "HIDDEN";
})(ReaderStatus || (ReaderStatus = {}));
export var ReaderTextStatus;
(function (ReaderTextStatus) {
    ReaderTextStatus["Active"] = "ACTIVE";
    ReaderTextStatus["Archived"] = "ARCHIVED";
})(ReaderTextStatus || (ReaderTextStatus = {}));
export var ReaderVoteTarget;
(function (ReaderVoteTarget) {
    ReaderVoteTarget["Annotation"] = "ANNOTATION";
    ReaderVoteTarget["Comment"] = "COMMENT";
})(ReaderVoteTarget || (ReaderVoteTarget = {}));
export var RemoteUserType;
(function (RemoteUserType) {
    RemoteUserType["Discord"] = "DISCORD";
})(RemoteUserType || (RemoteUserType = {}));
export var SortDirection;
(function (SortDirection) {
    SortDirection["Asc"] = "ASC";
    SortDirection["Desc"] = "DESC";
})(SortDirection || (SortDirection = {}));
export var VoteValue;
(function (VoteValue) {
    VoteValue["Down"] = "DOWN";
    VoteValue["Up"] = "UP";
})(VoteValue || (VoteValue = {}));
export const ListBlogPostsPagedDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "listBlogPostsPaged" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "pagination" } }, "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "PaginationInput" } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "blogQueries" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "listBlogPosts" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "pagination" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "pagination" } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "items" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "title" } }, { "kind": "Field", "name": { "kind": "Name", "value": "content" } }, { "kind": "Field", "name": { "kind": "Name", "value": "language" } }, { "kind": "Field", "name": { "kind": "Name", "value": "type" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "name" } }] } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "pageInfo" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "page" } }, { "kind": "Field", "name": { "kind": "Name", "value": "size" } }, { "kind": "Field", "name": { "kind": "Name", "value": "totalPages" } }, { "kind": "Field", "name": { "kind": "Name", "value": "totalCount" } }, { "kind": "Field", "name": { "kind": "Name", "value": "hasNextPage" } }, { "kind": "Field", "name": { "kind": "Name", "value": "hasPreviousPage" } }] } }] } }] } }] } }] };
export const LocateBlogPostDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "locateBlogPost" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "id" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "ID" } } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "blogQueries" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "locateBlogPost" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "id" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "id" } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "title" } }, { "kind": "Field", "name": { "kind": "Name", "value": "content" } }, { "kind": "Field", "name": { "kind": "Name", "value": "language" } }, { "kind": "Field", "name": { "kind": "Name", "value": "type" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "name" } }] } }] } }] } }] } }] };
export const PropertySetDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "propertySet" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "ownerKey" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "String" } } } }, { "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "name" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "String" } } } }, { "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "entry" } }, "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "String" } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "gaiaQueries" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "propertySet" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "ownerKey" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "ownerKey" } } }, { "kind": "Argument", "name": { "kind": "Name", "value": "name" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "name" } } }, { "kind": "Argument", "name": { "kind": "Name", "value": "entry" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "entry" } } }] }] } }] } }] };
export const ListTextsDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "listTexts" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "pagination" } }, "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "PaginationInput" } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "hadesQueries" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "texts" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "pagination" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "pagination" } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "items" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "title" } }, { "kind": "Field", "name": { "kind": "Name", "value": "language" } }, { "kind": "Field", "name": { "kind": "Name", "value": "level" } }, { "kind": "Field", "name": { "kind": "Name", "value": "ownerId" } }, { "kind": "Field", "name": { "kind": "Name", "value": "sourceId" } }, { "kind": "Field", "name": { "kind": "Name", "value": "status" } }] } }, { "kind": "Field", "name": { "kind": "Name", "value": "pageInfo" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "page" } }, { "kind": "Field", "name": { "kind": "Name", "value": "size" } }, { "kind": "Field", "name": { "kind": "Name", "value": "totalPages" } }, { "kind": "Field", "name": { "kind": "Name", "value": "totalCount" } }, { "kind": "Field", "name": { "kind": "Name", "value": "hasNextPage" } }, { "kind": "Field", "name": { "kind": "Name", "value": "hasPreviousPage" } }] } }] } }] } }] } }] };
export const LocateTextDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "query", "name": { "kind": "Name", "value": "locateText" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "id" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "ID" } } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "hadesQueries" }, "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "text" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "id" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "id" } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "title" } }, { "kind": "Field", "name": { "kind": "Name", "value": "content" } }, { "kind": "Field", "name": { "kind": "Name", "value": "language" } }, { "kind": "Field", "name": { "kind": "Name", "value": "level" } }, { "kind": "Field", "name": { "kind": "Name", "value": "ownerId" } }, { "kind": "Field", "name": { "kind": "Name", "value": "sourceId" } }, { "kind": "Field", "name": { "kind": "Name", "value": "status" } }, { "kind": "Field", "name": { "kind": "Name", "value": "createdAt" } }, { "kind": "Field", "name": { "kind": "Name", "value": "updatedAt" } }] } }] } }] } }] };
