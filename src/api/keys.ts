export const qk = {
  users: {
    deactivated: () => ['users', 'deactivated'] as const,
  },
  gyms: {
    all: ['gyms'] as const,
    list: () => [...qk.gyms.all, 'list'] as const,
    detail: (gymId: number) => [...qk.gyms.all, 'detail', gymId] as const,
  },
  boulders: {
    all: ['boulders'] as const,
    detail: (boulderId: number) => [...qk.boulders.all, 'detail', boulderId] as const,
    byWall: (wallImageId: number) => [...qk.boulders.all, 'wall', wallImageId] as const,
  },
  walls: {
    all: ['walls'] as const,
    list: (gymId: number) => [...qk.walls.all, 'list', gymId] as const,
    detail: (wallImageId: number) => [...qk.walls.all, 'detail', wallImageId] as const,
    thumbnail: (wallImageId: number) => [...qk.walls.all, 'thumbnail', wallImageId] as const,
    data: (wallImageId: number) => [...qk.walls.all, 'data', wallImageId] as const,
  },
}
