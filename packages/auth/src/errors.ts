import { CredentialsSignin } from 'next-auth';

export enum AuthErrorCode {
  NewEmailConflict = 'new_email_conflict',
  UnverifiedEmail = 'unverified_email',
  IncorrectEmailOrPassword = 'incorrect_email_or_password',
  TotpCodeRequired = 'totp_code_required',
  IncorrectTotpCode = 'incorrect_totp_code',
  MissingRecoveryCodes = 'missing_recovery_codes',
  IncorrectRecoveryCode = 'incorrect_recovery_code',
  RequestExpired = 'request_expired',
  RateLimitExceeded = 'rate_limit_exceeded',
  IllegalOAuthProvider = 'illegal_oauth_provider',
  InternalServerError = 'internal_server_error',
  MissingOAuthEmail = 'missing_oauth_email',
  AlreadyLinked = 'already_linked',
  RequiresExplicitLinking = 'requires_explicit_linking',
  UnknownError = 'unknown_error'
}

export class InternalServerError extends CredentialsSignin {
  constructor() {
    super(AuthErrorCode.InternalServerError);
  }
  code = AuthErrorCode.InternalServerError;
  stack = undefined;
}

export class IncorrectEmailOrPasswordError extends CredentialsSignin {
  constructor() {
    super(AuthErrorCode.IncorrectEmailOrPassword);
  }
  code = AuthErrorCode.IncorrectEmailOrPassword;
  stack = undefined;
}

export class TotpCodeRequiredError extends CredentialsSignin {
  constructor() {
    super(AuthErrorCode.TotpCodeRequired);
  }
  code = AuthErrorCode.TotpCodeRequired;
  stack = undefined;
}

export class IncorrectTotpCodeError extends CredentialsSignin {
  constructor() {
    super(AuthErrorCode.IncorrectTotpCode);
  }
  code = AuthErrorCode.IncorrectTotpCode;
  stack = undefined;
}

export class MissingRecoveryCodesError extends CredentialsSignin {
  constructor() {
    super(AuthErrorCode.MissingRecoveryCodes);
  }
  code = AuthErrorCode.MissingRecoveryCodes;
  stack = undefined;
}

export class IncorrectRecoveryCodeError extends CredentialsSignin {
  constructor() {
    super(AuthErrorCode.IncorrectRecoveryCode);
  }
  code = AuthErrorCode.IncorrectRecoveryCode;
  stack = undefined;
}

export class UnverifiedEmailError extends CredentialsSignin {
  constructor() {
    super(AuthErrorCode.UnverifiedEmail);
  }
  code = AuthErrorCode.UnverifiedEmail;
  stack = undefined;
}

export class RequestExpiredError extends CredentialsSignin {
  constructor() {
    super(AuthErrorCode.RequestExpired);
  }
  code = AuthErrorCode.RequestExpired;
  stack = undefined;
}

export class RateLimitExceededError extends CredentialsSignin {
  constructor() {
    super(AuthErrorCode.RateLimitExceeded);
  }
  code = AuthErrorCode.RateLimitExceeded;
  stack = undefined;
}

export { CredentialsSignin };
