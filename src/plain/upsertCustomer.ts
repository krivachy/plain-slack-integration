import { UpsertCustomerMutation } from './graphql';
import { PlainSdk } from './plainSdk';

export type Customer = Exclude<
  UpsertCustomerMutation['upsertCustomer']['customer'],
  undefined | null
>;

export async function upsertCustomer(
  sdk: PlainSdk,
  customer: { fullName: string; email: string }
): Promise<Customer> {
  const result = await sdk.upsertCustomer({
    input: {
      identifier: {
        emailAddress: customer.email,
      },
      onCreate: {
        fullName: customer.fullName,
        shortName: customer.fullName,
        email: {
          email: customer.email,
          isVerified: true,
        },
      },
      onUpdate: {},
    },
  });
  const upsertResult = result.data.upsertCustomer;
  if (upsertResult.error) {
    throw new Error(`Upsert customer failed: ${upsertResult.error.message}`);
  }
  if (!upsertResult.customer) {
    throw new Error(`Customer null: ${JSON.stringify(upsertResult)}`);
  }
  return upsertResult.customer;
}
