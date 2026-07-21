# Database ERD

```
User (1) ─── (1) Vendor
User (1) ─── (*) Order
User (1) ─── (1) Cart
User (1) ─── (*) Review
User (1) ─── (*) Enquiry (as customer)

Vendor (1) ─── (*) Product
Vendor (1) ─── (*) Enquiry (as vendor)

Category (1) ─── (*) Product
Category ─── Category (parent/child)

Product (1) ─── (*) Review
Product (1) ─── (*) OrderItem
Product (1) ─── (*) CartItem

Order (1) ─── (*) OrderItem (embedded)
Order (1) ─── (*) TimelineEvent (embedded)

Enquiry (1) ─── (*) Reply (embedded)

Coupon — used by Orders
Setting — singleton
CmsPage — flexible sections array
ActivityLog — audit trail
Notification — user notifications
```
