- Create new order and dispatch event order_created
- Payments will consume order_created event and process
- After payment success, the payment_received event will be dispatched to emails and shipping
    - Email send payment received email