
OVERVIEW
========
Install and configuration steps for recurly recurring payment module


INSTALL STEPS FOR PLATFORM DEVS
===============================
1. Run install.sh
2. System > Config > Platform > WDCA Mage Integration
2.1. URL: http://uptoday.ca/user/dev/wdcastaging/api/soap/?wsdl
2.2. API Username: platform_staging
2.3. API Password: platform123

INSTALLING RECURLY PAYMENT METHOD
=================================
1. Setup Recurly account
1.1. Grab Recurly API Key
1.2. Create Subscription Plans - one per product.
1.3. Enable Push Notifications and point them to /recurly/push 
1.4. Enable Recurly.js

2. Configure Magento
2.1. Associate any product that needs to have recurring pricing to a recurring plan
2.1.1. Set the product's price to whatever you want the customer to pay up front 
       (either $0 or whatever the initial payment is).  This should be matched
       up to what is in recurly.

2. Run install.sh
2.1. Make sure symlinks are enabled within Magento install

3. Configure Recurly settings in Magento under System > Config > Payments > Recurly
3.1. API Key
3.2. Subdomain
3.3. Terms & Conditions - this URL will be populated in the purchase form.
  