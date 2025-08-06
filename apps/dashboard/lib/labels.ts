import { AuthErrorCode } from '@workspace/auth/errors';
import { Provider } from '@workspace/auth/providers.types';
import {
  ContactRecord,
  ContactStage,
  FeedbackCategory,
  Role,
  WebhookTrigger
} from '@workspace/database/schema';

export const contactStageLabel: Record<ContactStage, string> = {
  [ContactStage.LEAD]: 'Lead',
  [ContactStage.QUALIFIED]: 'Qualified',
  [ContactStage.OPPORTUNITY]: 'Opportunity',
  [ContactStage.PROPOSAL]: 'Proposal',
  [ContactStage.IN_NEGOTIATION]: 'In negotiation',
  [ContactStage.LOST]: 'Lost',
  [ContactStage.WON]: 'Won'
};

export const contactRecordLabel: Record<ContactRecord, string> = {
  [ContactRecord.PERSON]: 'Person',
  [ContactRecord.COMPANY]: 'Company'
};

export const roleLabels: Record<Role, string> = {
  [Role.MEMBER]: 'Member',
  [Role.ADMIN]: 'Admin'
};

export const feedbackCategoryLabels: Record<FeedbackCategory, string> = {
  [FeedbackCategory.SUGGESTION]: 'Suggestion',
  [FeedbackCategory.PROBLEM]: 'Problem',
  [FeedbackCategory.QUESTION]: 'Question'
};

export const webhookTriggerLabels: Record<WebhookTrigger, string> = {
  [WebhookTrigger.CONTACT_CREATED]: 'Contact created',
  [WebhookTrigger.CONTACT_UPDATED]: 'Contact updated',
  [WebhookTrigger.CONTACT_DELETED]: 'Contact deleted'
};

export const identityProviderLabels: Record<Provider, string> = {
  [Provider.Credentials]: 'Credentials',
  [Provider.TotpCode]: 'TOTP code',
  [Provider.RecoveryCode]: 'Recovery code',
  [Provider.Google]: 'Google',
  [Provider.MicrosoftEntraId]: 'Microsoft'
};

export const authErrorLabels: Record<AuthErrorCode, string> = {
  [AuthErrorCode.NewEmailConflict]: 'Email already exists.',
  [AuthErrorCode.UnverifiedEmail]: 'Email is not verified.',
  [AuthErrorCode.IncorrectEmailOrPassword]: 'Email or password is not correct.',
  [AuthErrorCode.TotpCodeRequired]: 'TOTP code is required.',
  [AuthErrorCode.IncorrectTotpCode]: 'The TOTP code is not correct.',
  [AuthErrorCode.MissingRecoveryCodes]: 'Missing recovery codes.',
  [AuthErrorCode.IncorrectRecoveryCode]: 'The recovery code is not correct.',
  [AuthErrorCode.RequestExpired]: 'Request has expired.',
  [AuthErrorCode.RateLimitExceeded]: 'Rate limit exceeded.',
  [AuthErrorCode.IllegalOAuthProvider]: 'Illegal OAuth provider.',
  [AuthErrorCode.InternalServerError]:
    'Something went wrong. Please try again later.',
  [AuthErrorCode.MissingOAuthEmail]: 'Missing OAuth email.',
  [AuthErrorCode.AlreadyLinked]: 'OAuth account has been already linked.',
  [AuthErrorCode.RequiresExplicitLinking]:
    'Please sign in first to link this account',
  [AuthErrorCode.UnknownError]: 'Unknown error.'
};
