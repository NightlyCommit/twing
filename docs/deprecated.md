# Deprecated Features

This document lists deprecated features in Twig 2.x. Deprecated features are kept for backward compatibility and removed in the next major release (a feature that was deprecated in Twig 2.x is removed in Twig 3.0).

## Inheritance

* Defining a "block" definition in a non-capturing block in a child template is deprecated since Twig 2.5.0. When Twig 3.0 is available, Twing will throw a `TwingErrorSyntax` error. It does not work anyway, so most projects won't need to do anything to upgrade.

## Tags

* Using the `spaceless` tag at the root level of a child template is deprecated in Twig 2.5.0. This does not work as one would expect it to work anyway. When Twig 3.0 is available, Twing will throw a `TwingErrorSyntax` exception.
