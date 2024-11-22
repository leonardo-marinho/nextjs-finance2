import { TransactionController } from '@/lib/server/controllers/Transaction.controller';
import { ApiService } from '@/lib/server/services/Api.service';

export const GET = ApiService.createHandler(
  TransactionController.getTransactionById,
);
