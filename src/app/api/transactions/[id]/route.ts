import { TransactionController } from '@/lib/api/controllers/Transaction.controller';
import { ApiService } from '@/lib/api/services/Api.service';

export const GET = ApiService.createHandler(
  TransactionController.getTransactionById,
);
