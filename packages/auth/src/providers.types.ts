export enum Provider {
  Credentials = 'credentials',
  TotpCode = 'totp-code',
  RecoveryCode = 'recovery-code',
  Google = 'google',
  MicrosoftEntraId = 'microsoft-entra-id'
}

export enum OAuthProvider {
  Google = Provider.Google,
  MicrosoftEntraId = Provider.MicrosoftEntraId
}
