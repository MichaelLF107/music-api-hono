import { Prisma } from "@prisma/client";
import prisma from "../../../prisma/client";

class SongService {
  async create(data: Prisma.SongCreateInput) {
    const song = await prisma.song.create({ data });
    return song;
  }

  async findMany() {
    const songs = await prisma.song.findMany({
      include: { album: true, playlists: true },
    });
    return songs;
  }

  async findOne(id: number) {
    const song = await prisma.song.findUnique({
      where: { id },
      include: { album: true, playlists: true },
    });
    return song;
  }

  async search(title: string) {
    const songs = await prisma.song.findMany({
      where: { title: { contains: title } },
      include: { album: true, playlists: true },
    });
    return songs;
  }

  update(id: number, data: Prisma.SongUpdateInput) {
    const song = prisma.song.update({ where: { id }, data });
    return song;
  }

  async delete(id: number) {
    const song = await prisma.song.delete({ where: { id } });
    return song;
  }
}

export default new SongService();
