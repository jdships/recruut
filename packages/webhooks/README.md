# `@workspace/webhooks`

Webhooks are used by partner companies to create a possibility to react on events.
For example common webhooks are:

- voucher.redeemed
- customer.created
- checked.completed

Ideally you want to execute webhooks in a background job, because they can be executed async and in case they can't be delivered you can use a dead-letter-queue to park the failed webhook events.

## Features

- Send raw payload
- Send webhook payload
