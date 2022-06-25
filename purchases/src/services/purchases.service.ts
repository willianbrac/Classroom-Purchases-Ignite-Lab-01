import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { KafkaService } from 'src/messaging/kafka.service';

interface CreatePurchaseParams {
  customerId: string;
  productId: string;
}

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService, private kafka: KafkaService) {}

  findAll() {
    return this.prisma.purchase.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
  listaAllFromCustomer(customerId: string) {
    return this.prisma.purchase.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    });
  }
  async createPurchase({ customerId, productId }: CreatePurchaseParams) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new Error('Product not found');

    const purchase = await this.prisma.purchase.create({
      data: { customerId, productId },
    });

    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    /*****************************************KAFKA**********************************************/
    this.kafka.emit('purchase.new-purchase', {
      customer: {
        authUserId: customer.authUserId,
      },
      product: {
        id: product.id,
        title: product.title,
        slug: product.slug,
      },
    });
    /*****************************************KAFKA**********************************************/

    return purchase;
  }
}
