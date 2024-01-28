import { Prisma } from "@prisma/client";
import prisma from "../../../prisma/client";

class ArtistService {
  async create(data: Prisma.ArtistCreateInput) {
    const artist = await prisma.artist.create({ data });
    return artist;
  }

  async findMany() {
    const artists = await prisma.artist.findMany({
      include: { albums: true, songs: true },
    });
    return artists;
  }

  async findOne(id: number) {
    const artist = await prisma.artist.findUnique({
      where: { id },
      include: { albums: true, songs: true },
    });
    return artist;
  }

  async search(name: string) {
    const artists = await prisma.artist.findMany({
      where: { name: { contains: name } },
      include: { albums: true, songs: true },
    });
    return artists;
  }

  async update(id: number, data: Prisma.ArtistUpdateInput) {
    const artist = await prisma.artist.update({ where: { id }, data });
    return artist;
  }

  async delete(id: number) {
    const artist = await prisma.artist.delete({ where: { id } });
    return artist;
  }
}

export default new ArtistService();
