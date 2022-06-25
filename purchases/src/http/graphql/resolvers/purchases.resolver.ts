import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { AuthUser, CurrentUser } from 'src/http/auth/current-user';
import { CustomersService } from 'src/services/customers.service';
import { ProductsService } from 'src/services/products.service';
import { PurchasesService } from 'src/services/purchases.service';
import { CreatePurchaseInput } from '../inputs/create-purchase-input';
import { Purchase } from '../models/purchase';

@Resolver(() => Purchase)
export class PurchasesResolver {
  constructor(
    private purchasesService: PurchasesService,
    private productsService: ProductsService,
    private customersService: CustomersService,
  ) {}

  @UseGuards(AuthorizationGuard)
  @Query(() => [Purchase])
  purchases() {
    return this.purchasesService.findAll();
  }
  @ResolveField()
  product(@Parent() purchase: Purchase) {
    return this.productsService.getById(purchase.productId);
  }

  @UseGuards(AuthorizationGuard)
  @Mutation(() => Purchase)
  async createPurchase(
    @CurrentUser() user: AuthUser,
    @Args('data') data: CreatePurchaseInput,
  ) {
    let customer = await this.customersService.getCustomerByAuthUserId(
      user.sub,
    );
    if (!customer) {
      customer = await this.customersService.createCustomer({
        authUserId: user.sub,
      });
    }
    return this.purchasesService.createPurchase({
      productId: data.productId,
      customerId: customer.id,
    });
  }
}
