import { FinanceTrackerController } from '@/lib/api/controllers/FinanceTracker.controller';
import { ApiService } from '@/lib/api/services/Api.service';

export const PUT = ApiService.createHandler(
  FinanceTrackerController.updateTransaction,
);

export const DELETE = ApiService.createHandler(
  FinanceTrackerController.deleteTransaction,
);
