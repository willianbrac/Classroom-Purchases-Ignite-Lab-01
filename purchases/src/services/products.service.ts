import { BadRequestException, Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface CreateProductParams {
  title: string;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  findAll() {
    return this.prisma.product.findMany();
  }
  getById(id: string) {
    return this.prisma.product.findUnique({
      where: {
        id,
      },
    });
  }
  async create({ title }: CreateProductParams) {
    const slug = slugify(title, { lower: true });
    const productWithSameSlug = await this.prisma.product.findUnique({
      where: { slug },
    });
    if (productWithSameSlug) {
      throw new BadRequestException(
        'The product already exists with this slug!',
      );
    }
    return this.prisma.product.create({
      data: {
        title,
        slug,
      },
    });
  }
}
