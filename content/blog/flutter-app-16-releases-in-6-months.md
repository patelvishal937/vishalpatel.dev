---
title: Shipping a Flutter app to the App Store and Google Play 16 times in 6 months
seoTitle: Flutter app: 16 store releases in 6 months
description: How I took Greta AI from web-only to a Flutter app on iOS and Android: 16 store releases in six months, BLoC, LLM streaming, StoreKit 2 and Play Billing.
date: 2026-11-26
keywords: Flutter developer, shipping a Flutter app, Flutter App Store Google Play release, Flutter in-app purchase, StoreKit 2 Flutter, Google Play Billing Flutter, Flutter BLoC clean architecture, Flutter AI app
---

Greta started as a web product: describe an app, get a working project you can preview and deploy. But ideas do not wait for a laptop. On mobile web, **43% of users dropped off** before finishing a key project action, and mobile NPS was **minus 18**.

So I built the [Greta AI mobile app](/work/greta-mobile) in Flutter. Version 1.0 went live in March 2026. Version 2.0.4 shipped in August 2026. That is **16 store releases in about six months**, each one through review on both stores.

## One Flutter codebase, same backend as the web

The app is one **Flutter** codebase for iOS and Android. It talks to the same Greta backend as the web app, so a project you start on your phone opens in the web editor, and the other way round.

The structure that kept it manageable:

- **BLoC / Cubit** for state, inside a clean architecture
- **GoRouter** for navigation
- **GetIt** for dependency injection and **Dio** for networking
- **Sentry** for crashes and errors, **Firebase Cloud Messaging** for push notifications

With 16 releases, that split paid off. Each release touched a few features, and clean layers meant a change in one did not ripple through the rest.

## Streaming AI output to a phone

The core screen is a chat: you describe what you want and keep refining it. LLM tokens stream to the app over **AWS Lambda**, so you watch the build happen with a live code preview. You can switch the AI model at runtime, stop a generation, roll back, and deploy with one tap.

## In-app purchases on two stores

Credits and plans needed real in-app purchases: **StoreKit 2** on iOS and **Google Play Billing** on Android, both live in the same Flutter codebase.

Payments are one of the parts I never leave to an AI agent. I write them myself and test them by hand on real devices.

## The hard parts were not the UI

### One login, two kinds of customer

Greta has customers who joined through a lifetime deal, customers who subscribe on greta.sh, and some who are both. I worked through all three cases so each person lands in the app with the right account and plan.

### Expired sessions on old installs

Some users hit a "no token" error. I traced it to **older app versions** holding expired tokens. The current build fixes it, so the answer was getting those users onto it. The lesson: when you ship fast, the bug is often in a version someone still has installed, not in your code today.

### Rewards that give people a reason to return

Daily streaks, challenges and a spin-the-wheel award bonus credits and give people a reason to open the app again. They shipped across several releases, a piece at a time, instead of one big launch.

## How 16 releases stayed safe

Small, focused releases. Each one did a few things well and went through review on both stores. Small scope meant small risk, quicker reviews, and a fast way back if something broke.

## Results

As of November 2026:

- **2,500+ downloads** across both stores
- **4.8 stars** on Google Play, from 34 reviews
- **920 monthly active users**, up 18.4%
- **29k events** in 30 days, up 21.7%

## FAQ

### Is Flutter good for an AI app with streaming output?

It worked well for us. One codebase covered iOS and Android, and streamed LLM tokens render as they arrive, so people see the build happen live.

### Can one Flutter app handle StoreKit 2 and Google Play Billing?

Yes. Greta's app ships StoreKit 2 on iOS and Google Play Billing on Android from one Flutter codebase.

The full story, with real screens from the app, is in the [Greta AI mobile app case study](/work/greta-mobile).

Hiring a Flutter developer who has shipped to both stores, handled payments and kept a fast release cadence? [Get in touch](/contact). I am in Ahmedabad, India, and open to remote roles.
