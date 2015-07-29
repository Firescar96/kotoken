# kotoken
rails project to demonstrate bitcoin in the background

This is a ruby web app initially designed for knotty.media.mit.edu to use at their knotty objects conference.

The idea is each attendee gets a card with a unique 5 digit account number (although all accounts are open for registration, not just those on cards). They can then register on the site to lock out other attendees. I use the chain API to then preload their account with 10 of their selected tokens and to link transactions between attendees to a public ledger. 

In other words, attendees get the effects of using bitcoin, but don't have to directly use the currency.
