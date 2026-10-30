export interface LegalSection {
  id: string;
  title: string;
  content: string[];
}

export const PRIVACY_CONTENT = {
  title: "MyMemori Privacy Policy",
  subtitle: "Effective date: October 28, 2026",
  lastUpdated: "October 28, 2026",
  sections: [
    {
      id: "introduction",
      title: "1. Introduction",
      content: [
        "MyMemori (\"MyMemori\", \"we\", \"us\", \"our\") operates the live event photo-sharing platform available at https://mymemori.yourara.com (the \"Service\"). This Privacy Policy explains what personal information we collect, how we use it, who we share it with, and the choices and rights you have.",
        "The Service is operated by Toddlers Town Multipurpose Ventures, based in Nigeria. By using the Service you agree to the practices described here. If you do not agree, please do not use the Service."
      ]
    },
    {
      id: "information-we-collect",
      title: "2. Information We Collect",
      content: [
        "2.1 Information you give us:",
        "• Account information: your name, email address, and password (stored only in hashed form) when you create an account.",
        "• Event information: event names, dates, descriptions, and settings that organizers create.",
        "• Content: photos and any captions or text you upload to an event.",
        "• Guest information: names or email addresses that guests choose to provide when joining an event.",
        "• Support messages: anything you send us when you contact us.",
        "2.2 Information from Google Sign-In:",
        "If you choose to sign in with Google, we receive your name, email address, profile picture, and Google account identifier with your permission. We request only basic sign-in information (openid, email, profile scopes). We do not access your Gmail, Google Drive, Google Photos, Google Contacts, Calendar, or any other Google service data.",
        "2.3 Payment information:",
        "Payments are processed by our third-party payment providers, Paystack and Flutterwave. We do not collect or store your full card number, CVV, or bank login details. We receive and store transaction references, payment status, amount, currency, and the email associated with the payment.",
        "2.4 Technical information collected automatically:",
        "• IP address (used for security, fraud prevention, and to route you to the right payment provider).",
        "• Browser type, device type, and operating system.",
        "• Log data such as pages requested, timestamps, and error reports.",
        "• Authentication tokens stored in your browser so you stay signed in.",
        "• Analytics tools including Google Analytics and Vercel Analytics (to help us understand page visits, device type, and approximate location derived from IP)."
      ]
    },
    {
      id: "how-we-use",
      title: "3. How We Use Your Information",
      content: [
        "We use your information to:",
        "• Create and manage your account and authenticate you (including via Google Sign-In);",
        "• Provide the Service: creating events, uploading, processing, storing, and sharing photos;",
        "• Process payments and prevent fraud;",
        "• Send transactional emails such as password resets, payment confirmations, and event notifications;",
        "• Respond to support requests;",
        "• Keep the Service secure, debug problems, and prevent abuse;",
        "• Comply with legal obligations; and",
        "• Improve the Service.",
        "We do not use your information to show third-party advertising."
      ]
    },
    {
      id: "google-data",
      title: "4. Google User Data",
      content: [
        "MyMemori's use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements. Specifically, for data we receive through Google Sign-In:",
        "• We use it only to create your account, sign you in, and show your name and profile picture within the Service.",
        "• We do not sell it or transfer it to third parties, except as needed to provide the Service (for example, hosting providers acting on our behalf) or to comply with law.",
        "• We do not use it for advertising, including personalised or retargeted advertising.",
        "• We do not use it to train generalised artificial intelligence or machine learning models.",
        "• No human reads your Google data, except where you give consent, where needed for security or abuse investigation, or where required by law.",
        "You can revoke MyMemori's access at any time at https://myaccount.google.com/permissions. You can also request deletion of your account and data as described in Section 9."
      ]
    },
    {
      id: "how-photos-shared",
      title: "5. How Photos and Events Are Shared",
      content: [
        "Event photos are visible to people who have access to the event, for example through an event link or QR code. Organizers decide who can join and what is visible. Please treat event links like a key: anyone who has the link may be able to view the event.",
        "Photos you upload may show other people. You should only upload content you have the right to share and, where appropriate, with the consent of the people shown.",
        "Guests and organizers may be able to view and download photos, depending on event settings.",
        "If you appear in a photo and want it removed, contact us at support@yourara.com, or ask the event organizer."
      ]
    },
    {
      id: "who-we-share-with",
      title: "6. Who We Share Information With",
      content: [
        "We do not sell your personal information. We share it only with:",
        "• Service providers who help us run the Service under data protection obligations, including Paystack and Flutterwave (payment processing), Resend (email delivery), Google (sign-in and Google Analytics), Vercel (frontend hosting and analytics), Render (backend hosting), and Cloudinary (photo and image storage and delivery).",
        "• Other users, as described in Section 5 (for example, your name and uploaded photos within an event).",
        "• Authorities or other parties when required by law, court order, or to protect rights, safety, and security.",
        "• A successor in a merger, acquisition, or sale of assets, in which case we will notify you and this policy will continue to apply."
      ]
    },
    {
      id: "data-retention",
      title: "7. Data Retention",
      content: [
        "• Account data is kept while your account is active.",
        "• Event photos are kept until the organizer or uploader deletes them, or until the account is closed and its data is deleted.",
        "• Payment records are kept for as long as required by tax and accounting laws.",
        "• Security logs are kept for up to 90 days.",
        "• When you delete your account, we delete or anonymise your personal data within 30 days, except where we must retain it by law or to resolve disputes.",
        "• Password reset tokens expire after 30 minutes and are stored only in hashed form."
      ]
    },
    {
      id: "security",
      title: "8. Security",
      content: [
        "We use reasonable technical and organisational measures to protect your data, including encrypted connections (HTTPS), hashed passwords, hashed and short-lived password reset tokens, and signature verification of payment webhooks.",
        "No system is completely secure, so we cannot guarantee absolute security. Please use a strong, unique password and keep your login details private."
      ]
    },
    {
      id: "your-rights",
      title: "9. Your Rights and Choices",
      content: [
        "Under the Nigeria Data Protection Act 2023 and, where applicable, other data protection laws (such as the GDPR), you may have the right to:",
        "• Access the personal data we hold about you;",
        "• Correct inaccurate data;",
        "• Request deletion of your data;",
        "• Object to or restrict certain processing;",
        "• Withdraw consent where we rely on it; and",
        "• Receive a copy of your data in a portable format.",
        "To exercise these rights, or to request deletion of your account, email us at support@yourara.com. We may need to verify your identity first. You also have the right to lodge a complaint with the Nigeria Data Protection Commission (NDPC)."
      ]
    },
    {
      id: "cookies",
      title: "10. Cookies and Local Storage",
      content: [
        "We use cookies and browser local storage to keep you signed in, remember your preferences, and keep the Service secure. You can clear these in your browser settings, but some features may stop working."
      ]
    },
    {
      id: "international-transfers",
      title: "11. International Transfers",
      content: [
        "Our service providers may process data in countries outside Nigeria. Where we transfer personal data internationally, we take steps to ensure appropriate safeguards are in place as required by applicable law."
      ]
    },
    {
      id: "children",
      title: "12. Children's Privacy",
      content: [
        "The Service is not directed to children under 13. We do not knowingly collect personal data from them. If you believe a child has provided us with personal data, contact us and we will delete it. Users under 18 should use the Service only with the permission of a parent or guardian."
      ]
    },
    {
      id: "changes",
      title: "13. Changes to This Policy",
      content: [
        "We may update this policy from time to time. We will post the new version here with a new \"last updated\" date, and notify you by email or in the Service if the changes are significant."
      ]
    },
    {
      id: "contact",
      title: "14. Contact Us",
      content: [
        "MyMemori (Toddlers Town Multipurpose Ventures, Nigeria)",
        "Email: support@yourara.com",
        "Website: https://mymemori.yourara.com"
      ]
    }
  ]
};

export const TERMS_CONTENT = {
  title: "MyMemori Terms of Service",
  subtitle: "Effective date: October 28, 2026",
  lastUpdated: "October 28, 2026",
  sections: [
    {
      id: "acceptance",
      title: "1. Acceptance of These Terms",
      content: [
        "These Terms of Service (\"Terms\") are a legal agreement between you and Toddlers Town Multipurpose Ventures (\"MyMemori\", \"we\", \"us\", \"our\") governing your use of the MyMemori live event photo-sharing platform at https://mymemori.yourara.com (the \"Service\").",
        "By creating an account, signing in (including with Google), joining an event, or otherwise using the Service, you agree to these Terms and to our Privacy Policy. If you do not agree, do not use the Service."
      ]
    },
    {
      id: "eligibility",
      title: "2. Eligibility",
      content: [
        "You must be at least 13 years old to create an account or use the Service. If you are under 18 (or the age of majority where you live), you may use the Service, organize events, or make payments only with the permission and supervision of a parent or guardian, who agrees to these Terms on your behalf.",
        "If you use the Service on behalf of an organization, you confirm you have authority to bind it to these Terms."
      ]
    },
    {
      id: "account",
      title: "3. Your Account",
      content: [
        "• You can register with an email and password or with Google Sign-In.",
        "• You must provide accurate information and keep it up to date.",
        "• You are responsible for keeping your login details secure and for all activity under your account. Tell us immediately at support@yourara.com if you suspect unauthorised use.",
        "• We may suspend or close accounts that breach these Terms or put the Service or other users at risk."
      ]
    },
    {
      id: "the-service",
      title: "4. The Service",
      content: [
        "MyMemori lets event organizers create events and lets organizers and guests upload, view, and share photos from those events, typically through a link or QR code.",
        "We may change, add, or remove features at any time, and we do not promise the Service will always be available or error-free."
      ]
    },
    {
      id: "organizers-guests",
      title: "5. Organizers and Guests",
      content: [
        "If you are an organizer, you are responsible for:",
        "• Deciding who can access your event and sharing event links responsibly;",
        "• Informing guests that photos will be taken and shared through MyMemori, and obtaining any consents required by law;",
        "• The content uploaded to your event and how it is used.",
        "If you are a guest, you are responsible for the content you upload and for respecting the privacy of others."
      ]
    },
    {
      id: "your-content",
      title: "6. Your Content",
      content: [
        "You own your content: We do not claim ownership of the photos and other material you upload (\"Your Content\").",
        "License to us: You grant us a worldwide, non-exclusive, royalty-free license to host, store, process (for example resize and compress), display, and transmit Your Content solely to operate, secure, and improve the Service and to show it to the people you or the organizer choose to share it with.",
        "Your promises: You confirm that you own Your Content or have the right to upload it, and that doing so does not violate any law or anyone's rights, including privacy, publicity, and copyright.",
        "Other people in photos: You must not upload photos of people in a way that violates their privacy, or that they would reasonably object to, without their permission."
      ]
    },
    {
      id: "acceptable-use",
      title: "7. Acceptable Use",
      content: [
        "You must not:",
        "• Upload content that is illegal, sexually explicit, exploits or endangers minors, hateful, harassing, threatening, or promotes violence;",
        "• Infringe intellectual property, privacy, or other rights;",
        "• Upload malware or attempt to disrupt, overload, or gain unauthorised access to the Service, other accounts, or our systems;",
        "• Scrape, reverse engineer, or copy the Service except as permitted by law;",
        "• Use the Service for spam, fraud, or deception, or impersonate others;",
        "• Bypass payment, security, or access controls; or",
        "• Use the Service in violation of applicable law.",
        "We may remove content and suspend or terminate accounts that violate these rules, with or without notice."
      ]
    },
    {
      id: "payments",
      title: "8. Payments",
      content: [
        "Some features require payment. Prices and plans are shown in the Service before you pay.",
        "Payments are processed by third-party providers (Paystack and Flutterwave). Their terms also apply, and we are not responsible for their services.",
        "Unless stated otherwise at purchase, prices are shown in Nigerian Naira (NGN) and US Dollars (USD), and any exchange rates or bank charges applied by your bank or payment provider are outside our control. Applicable taxes, if any, are shown at checkout.",
        "Refunds: You may request a full refund within 7 days of purchase, provided the event has not yet started. After 7 days, or once an event has started, payments are non-refundable, except where required by law or where we fail to deliver the Service. To request a refund, email support@yourara.com.",
        "You are responsible for any payment provider or bank charges on your side."
      ]
    },
    {
      id: "intellectual-property",
      title: "9. Intellectual Property",
      content: [
        "The Service, including its software, design, branding, and logos, is owned by MyMemori and protected by law. These Terms do not give you any rights to them except the limited right to use the Service as described.",
        "Feedback you give us may be used without obligation to you."
      ]
    },
    {
      id: "copyright-removal",
      title: "10. Copyright and Content Removal",
      content: [
        "If you believe content on MyMemori infringes your rights or shows you without permission, email support@yourara.com with the event link, a description of the content, and your contact details. We will review and may remove it. We may terminate accounts of repeat infringers."
      ]
    },
    {
      id: "third-party",
      title: "11. Third-Party Services",
      content: [
        "The Service relies on third-party services, including Google (sign-in), Paystack and Flutterwave (payments), and our email, hosting, and storage providers. We are not responsible for third-party services, and your use of them is subject to their own terms."
      ]
    },
    {
      id: "disclaimers",
      title: "12. Disclaimers",
      content: [
        "The Service is provided \"as is\" and \"as available\", without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, and non-infringement, to the fullest extent permitted by law.",
        "We do not guarantee that uploads will never be lost, that the Service will be uninterrupted, or that content will remain available. Keep your own copies of photos you care about."
      ]
    },
    {
      id: "liability",
      title: "13. Limitation of Liability",
      content: [
        "To the fullest extent permitted by law, MyMemori and its founders, employees, and partners are not liable for indirect, incidental, special, consequential, or punitive damages, or for loss of data, photos, profits, or goodwill arising from your use of the Service.",
        "Our total liability for any claim relating to the Service is limited to the greater of the amount you paid us in the 12 months before the claim or NGN 10,000. Nothing in these Terms excludes liability that cannot be excluded by law."
      ]
    },
    {
      id: "indemnity",
      title: "14. Indemnity",
      content: [
        "You agree to defend and indemnify MyMemori against claims, damages, and costs (including reasonable legal fees) arising from Your Content, your breach of these Terms, or your violation of any law or third-party right."
      ]
    },
    {
      id: "termination",
      title: "15. Suspension and Termination",
      content: [
        "You may stop using the Service and delete your account at any time by contacting support@yourara.com. We may suspend or terminate your access if you breach these Terms, if required by law, or if we discontinue the Service.",
        "After termination, your right to use the Service ends, and we may delete your content in line with our Privacy Policy. Sections that by their nature should survive (for example intellectual property, disclaimers, liability, and indemnity) will survive."
      ]
    },
    {
      id: "changes",
      title: "16. Changes to These Terms",
      content: [
        "We may update these Terms. We will post the new version with an updated date and notify you by email or in the Service for material changes. Continued use after the changes take effect means you accept them."
      ]
    },
    {
      id: "governing-law",
      title: "17. Governing Law and Disputes",
      content: [
        "These Terms are governed by the laws of the Federal Republic of Nigeria.",
        "We will try to resolve any dispute informally first by contacting you or you contacting us. If that fails, disputes will be subject to the courts of the Federal Capital Territory, Abuja, Nigeria, unless the law gives you the right to bring a claim elsewhere."
      ]
    },
    {
      id: "general",
      title: "18. General",
      content: [
        "These Terms and the Privacy Policy are our entire agreement with you. If any part is found unenforceable, the rest remains in effect. Our failure to enforce a right is not a waiver.",
        "You may not transfer your rights under these Terms without our consent; we may transfer ours as part of a business transfer."
      ]
    },
    {
      id: "contact",
      title: "19. Contact",
      content: [
        "MyMemori (Toddlers Town Multipurpose Ventures, Nigeria)",
        "Email: support@yourara.com",
        "Website: https://mymemori.yourara.com"
      ]
    }
  ]
};

export const CONTACT_INFO = {
  title: "Get in Touch",
  subtitle: "Have questions, feedback, or need help with your events? We'd love to hear from you.",
  email: "support@yourara.com",
  supportEmail: "support@yourara.com",
  partnershipsEmail: "support@yourara.com",
  website: "https://mymemori.yourara.com",
  company: "Toddlers Town Multipurpose Ventures",
  location: "Abuja, Nigeria",
  socials: [
    { name: "Instagram", handle: "@mymemori.app", href: "https://instagram.com" },
    { name: "Twitter / X", handle: "@mymemoriapp", href: "https://x.com" },
    { name: "TikTok", handle: "@mymemori", href: "https://tiktok.com" }
  ],
  responseHours: "Usually responds within 24 hours"
};
