interface CreateRoutieResponseType {
  routieSpaceIdentifier: string;
}

interface GetRoutieSpaceResponseType {
  name: string;
}

interface EditRoutieSpaceNameRequestType {
  name: string;
}

interface EditRoutieSpaceNameResponseType {
  name: string;
}

interface GetRoutieSpaceListResponseType {
  routieSpaces: {
    identifier: string;
    name: string;
    createdTime: string;
  }[];
}

interface DeleteRoutieSpaceRequestType {
  routieSpaceUuid: string;
}

export type {
  CreateRoutieResponseType,
  GetRoutieSpaceResponseType,
  EditRoutieSpaceNameRequestType,
  EditRoutieSpaceNameResponseType,
  GetRoutieSpaceListResponseType,
  DeleteRoutieSpaceRequestType,
};
