import { FinanceTrackerController } from '@/lib/server/controllers/FinanceTracker.controller';
import { ApiService } from '@/lib/server/services/Api.service';

export const PUT = ApiService.createHandler(
  FinanceTrackerController.updateTransaction,
);

export const DELETE = ApiService.createHandler(
  FinanceTrackerController.deleteTransaction,
);
