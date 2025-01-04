import { FinanceTrackerController } from '@/lib/api/controllers/FinanceTracker.controller';
import { ApiUtils } from '@/lib/api/utils/Api.utils';

export const PUT = ApiUtils.handleMethod(
  FinanceTrackerController.updateTransaction,
);

export const DELETE = ApiUtils.handleMethod(
  FinanceTrackerController.deleteTransaction,
);
