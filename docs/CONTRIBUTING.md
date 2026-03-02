# Contributing
Hi! I'm really excited that you are interested in contributing to Flugent. This project is open to, and grateful for, any contributions made by the community.

## Design principles
> Defer the decision until it can be made responsibly, based on real knowledge — but not so late that you cannot benefit from that knowledge.

Flugence separates **module boundaries** from **executable boundaries**.

Modules define logical architecture.  
Executables define runtime deployment.

This separation allows you to change deployment strategy without restructuring your codebase.

Once the main goal was clear, I wanted it to be lean and unopinionated. It is a 0-dependencies package that is compatible with the main JS coding styles, a priori all popular transport technologies (RESTful calls, RPC, events, etc.), popular architectures (DDD, SOA, EDA, etc.) and common backend features and technologies (e.g. authentication), thanks to the plugin system.
