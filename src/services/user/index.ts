import { Prisma } from "@prisma/client";
import prisma from "../../../prisma/client";

class UserService {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({ data });
    return user;
  }

  async findMany() {
    const users = await prisma.user.findMany();
    return users;
  }

  async findById(id: number) {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  }

  async search(name: string) {
    const users = await prisma.user.findMany({
      where: { name: { contains: name } },
      include: { playlists: true },
    });
    return users;
  }

  async likeSong(userId: number, songId: number) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { likedSongs: { connect: { id: songId } } },
    });
    return user;
  }

  async unlikeSong(userId: number, songId: number) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { likedSongs: { disconnect: { id: songId } } },
    });
    return user;
  }

  async likeAlbum(userId: number, albumId: number) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { likedAlbums: { connect: { id: albumId } } },
    });
    return user;
  }

  async unlikeAlbum(userId: number, albumId: number) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { likedAlbums: { disconnect: { id: albumId } } },
    });
    return user;
  }

  async update(id: number, data: Prisma.UserUpdateInput) {
    const user = await prisma.user.update({ where: { id }, data });
    return user;
  }

  async delete(id: number) {
    const user = await prisma.user.delete({ where: { id } });
    return user;
  }
}

export default new UserService();
