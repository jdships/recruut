import { ContactStage } from '@workspace/database/schema';

export const contactStageColor: Record<ContactStage, string> = {
  [ContactStage.LEAD]: 'bg-gray-600 ring-1 ring-gray-100 dark:ring-gray-900',
  [ContactStage.QUALIFIED]:
    'bg-yellow-600 ring-1 ring-yellow-100 dark:ring-yellow-900',
  [ContactStage.OPPORTUNITY]:
    'bg-orange-600  ring-1 ring-orange-100 dark:ring-orange-900',
  [ContactStage.PROPOSAL]:
    'bg-blue-600 ring-1 ring-blue-100 dark:ring-blue-900',
  [ContactStage.IN_NEGOTIATION]:
    'bg-teal-600 ring-1 ring-teal-100 dark:ring-teal-900',
  [ContactStage.LOST]: 'bg-red-600 ring-1 ring-red-100 dark:ring-red-900',
  [ContactStage.WON]: 'bg-green-600 ring-1 ring-green-100 dark:ring-green-900'
};
