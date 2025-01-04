import { TransactionController } from '@/lib/api/controllers/Transaction.controller';
import { ApiUtils } from '@/lib/api/utils/Api.utils';

export const GET = ApiUtils.handleMethod(
  TransactionController.getTransactionById,
);
