---
title: Shipping a Flutter app to the App Store and Google Play 16 times in 6 months
description: How I took Greta AI from web-only to a Flutter app on iOS and Android, shipping 16 store releases from March to August 2026, with BLoC, StoreKit 2, Google Play Billing and a login for two kinds of customer.
date: 2026-11-26
keywords: Flutter developer, Flutter app release App Store Google Play, Flutter in-app purchase StoreKit 2, Google Play Billing Flutter, Flutter BLoC clean architecture, Flutter release cadence, Flutter AI app
---

Greta started as a web product: describe an app, get a working project you can preview and deploy. But ideas do not wait for a laptop. On mobile web, **43% of users dropped off** before finishing a key project action, and mobile NPS was **minus 18**.

So I built the [Greta AI mobile app](/work/greta-mobile) in Flutter. Version 1.0 went live on the App Store on 6 March 2026. Version 2.0.4 shipped on 21 August 2026. That is **16 store releases in about six months**, each one through two store reviews.

## One codebase, same backend as the web

The app is one **Flutter** codebase for iOS and Android. It talks to the same Greta backend as the web app, so a project you start on your phone opens in the web editor, and the other way round.

The structure that kept it manageable:

- **BLoC / Cubit** for state, with clean architecture split into data, domain and presentation
- **GoRouter** for navigation, driven by the auth state
- **GetIt** for dependency injection and **Dio** for networking
- **Sentry** for crashes and errors, **Firebase Cloud Messaging** for push notifications

## Streaming AI output to a phone

The core screen is a chat: you describe what you want and keep refining it. LLM tokens stream to the app over **AWS Lambda**, so you watch the build happen with a live code preview. You can switch the AI model at runtime, stop a generation, roll back, and deploy with one tap.

## Payments on two stores

Credits and plans needed real in-app purchases: **StoreKit 2** on iOS and **Google Play Billing** on Android, both live, both crediting the same Greta balance the web uses. Payments are one of the parts I never leave to an AI agent. I wrote and tested them by hand.

## The hard parts were not the UI

### One login, two kinds of customer

Greta has customers who joined through a lifetime deal, customers who subscribe on greta.sh, and some who are both. I worked through all three cases so each person lands in the app with the right account and plan.

### Expired sessions on old installs

Some users hit a "no token" error. I traced it to **older app versions** holding expired tokens. The current build did not have the bug, so the fix was to move those users onto the latest release. The lesson: when you ship fast, the bug is often in a version someone still has installed, not in your code today.

### Rewards that actually land

Daily streaks, challenges and a spin-the-wheel give people a reason to come back, and they award bonus credits. A reward only works if the credit lands. I reviewed the backend change that routes every credit award through one helper and reports failures to Sentry instead of failing silently, and checked it against the app flow for both kinds of customer.

## How 16 releases stayed safe

Small, focused releases. Each one did a few things well and went through both store reviews. Small scope meant small risk, quick reviews, and a fast way back if something broke.

## Results

As of November 2026:

- **2,500+ downloads** across both stores
- **4.8 stars** on Google Play
- **920 monthly active users**, up 18.4%
- **29k events** in 30 days, up 21.7%

The full story, with real screens from the app, is in the [Greta AI mobile app case study](/work/greta-mobile).

Hiring a Flutter developer who has shipped to both stores, handled payments and kept a fast release cadence? [Get in touch](/contact). I am in Ahmedabad, India, and open to remote roles.
