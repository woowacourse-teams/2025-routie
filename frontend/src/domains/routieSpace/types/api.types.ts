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

export type {
  CreateRoutieResponseType,
  GetRoutieSpaceResponseType,
  EditRoutieSpaceNameRequestType,
  EditRoutieSpaceNameResponseType,
};
