export const prismaPlaybackSessionMock = {
  create: jest.fn(),
  findMany: jest.fn(),
  delete: jest.fn(),
};

export const prismaMock = {
  playbackSession: prismaPlaybackSessionMock,
};
