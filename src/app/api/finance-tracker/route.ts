import { FinanceTrackerController } from '@/lib/server/controllers/FinanceTracker.controller';
import { ApiService } from '@/lib/server/services/Api.service';

export const POST = ApiService.createHandler(
  FinanceTrackerController.createTransaction,
);
