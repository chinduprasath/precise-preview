# Checkout, Payment, and Confirmation Flow

## Goal
Rebuild the order checkout to closely follow the attached reference while using Influence Connect’s existing typography, colors, and reusable controls.

## Changes
- Redesign `/checkout` as a professional two-column review screen with:
  - Back to Orders navigation and a clear checkout heading
  - Creator profile and campaign summary
  - Complete order details, schedule, deliverables, and target link
  - Payment-method selection for UPI, card, and wallet
  - Coupon entry and a sticky payment summary
  - No “slot held,” “view profile,” or “campaign brief” content
- Redesign `/payment` as the focused second step:
  - Preserve the selected order, coupon, totals, and payment method
  - Show and validate the appropriate payment fields
  - Present a consistent order summary and secure payment action
- Add `/order-confirmation` as the final thank-you page:
  - Show payment success, order number, paid amount, and next steps
  - Provide buttons to view orders or return to the business dashboard
- Keep navigation state intact through the complete order-placement flow and safely return incomplete direct visits to Orders.

## Technical Details
- Centralize checkout fee and total calculations so checkout, payment, and confirmation display identical amounts.
- Use existing semantic design tokens, site font, Button/Input controls, and responsive layout conventions.
- Validate the central flow in the running app across desktop and mobile widths.
