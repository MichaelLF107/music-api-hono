import { Prisma } from "@prisma/client";
import prisma from "../../../prisma/client";

class GenreService {
  async create(data: Prisma.GenreCreateInput) {
    const genre = await prisma.genre.create({ data });
    return genre;
  }

  async findMany() {
    const genres = await prisma.genre.findMany({ include: { albums: true } });
    return genres;
  }

  async findOne(id: number) {
    const genre = await prisma.genre.findUnique({
      where: { id },
      include: { albums: true },
    });
    return genre;
  }

  async search(name: string) {
    const genres = await prisma.genre.findMany({
      where: { name: { contains: name } },
      include: { albums: true },
    });
    return genres;
  }

  async update(id: number, data: Prisma.GenreUpdateInput) {
    const genre = await prisma.genre.update({ where: { id }, data });
    return genre;
  }

  async delete(id: number) {
    const genre = await prisma.genre.delete({ where: { id } });
    return genre;
  }
}

export default new GenreService();
