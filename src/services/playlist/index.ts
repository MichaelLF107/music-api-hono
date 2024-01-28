import { Prisma } from "@prisma/client";
import prisma from "../../../prisma/client";

class PlaylistService {
  async create(data: Prisma.PlaylistCreateInput) {
    const playlist = await prisma.playlist.create({ data });
    return playlist;
  }

  async findMany() {
    const playlists = await prisma.playlist.findMany({
      include: { songs: true, user: true },
    });
    return playlists;
  }

  async findOne(id: number) {
    const playlist = await prisma.playlist.findUnique({
      where: { id },
      include: { songs: true, user: true },
    });
    return playlist;
  }

  async search(name: string) {
    const playlists = await prisma.playlist.findMany({
      where: { name: { contains: name } },
      include: { songs: true, user: true },
    });
    return playlists;
  }

  async addSong(playlistId: number, songId: number) {
    const playlist = await prisma.playlist.update({
      where: { id: playlistId },
      data: { songs: { connect: { id: songId } } },
    });
    return playlist;
  }

  async removeSong(playlistId: number, songId: number) {
    const playlist = await prisma.playlist.update({
      where: { id: playlistId },
      data: { songs: { disconnect: { id: songId } } },
    });
    return playlist;
  }

  async update(id: number, data: Prisma.PlaylistUpdateInput) {
    const playlist = await prisma.playlist.update({ where: { id }, data });
    return playlist;
  }

  async delete(id: number) {
    const playlist = await prisma.playlist.delete({ where: { id } });
    return playlist;
  }
}

export default new PlaylistService();
