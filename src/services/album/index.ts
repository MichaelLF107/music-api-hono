import { Prisma } from "@prisma/client";
import prisma from "../../../prisma/client";

class AlbumService {
  async create(data: Prisma.AlbumCreateInput) {
    const album = await prisma.album.create({ data });
    return album;
  }

  async findMany() {
    const albums = await prisma.album.findMany({
      include: { songs: true },
    });
    return albums;
  }

  async findOne(id: number) {
    const album = await prisma.album.findUnique({
      where: { id },
      include: { songs: true },
    });
    return album;
  }

  async search(title: string) {
    const albums = await prisma.album.findMany({
      where: { title: { contains: title } },
      include: { songs: true },
    });
    return albums;
  }

  async addSong(albumId: number, songId: number) {
    const album = await prisma.album.update({
      where: { id: albumId },
      data: { songs: { connect: { id: songId } } },
    });
    return album;
  }

  async removeSong(albumId: number, songId: number) {
    const album = await prisma.album.update({
      where: { id: albumId },
      data: { songs: { disconnect: { id: songId } } },
    });
    return album;
  }

  async update(id: number, data: Prisma.AlbumUpdateInput) {
    const album = await prisma.album.update({ where: { id }, data });
    return album;
  }

  async delete(id: number) {
    const album = await prisma.album.delete({ where: { id } });
    return album;
  }
}

export default new AlbumService();
