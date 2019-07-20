{% raw %}

# Forewords about terminology

In this documentation, the `Twig` term represents the Twig language *specifications*, not the SensioLabs PHP *implementation* of the language - implementation being known as `TwigPHP`. SensioLabs use `Twig` to talk about both the specifications of the language and their implementation, and their documentation mix both specifications and implementation details. This should be considered as an oversight instead of an official convention.

`Twing` is a Node.js implementation of `Twig` language specifications.

# Deprecated Features

This document lists deprecated features in Twig 2.x. Deprecated features are kept for backward compatibility and removed in the next major release (a feature that was deprecated in Twig 2.x is removed in Twig 3.0).

## Inheritance

* Defining a "block" definition in a non-capturing block in a child template is deprecated since Twig 2.5.0. When Twig 3.0 is available, Twing will throw a `TwingErrorSyntax` error. It does not work anyway, so most projects won't need to do anything to upgrade.

## Tags

* Using the `spaceless` tag at the root level of a child template is deprecated since Twig 2.5.0. This does not work as one would expect it to work anyway. When Twig 3.0 is available, Twing will throw a `TwingErrorSyntax` exception.

* The `spaceless` tag is deprecated since Twig 2.7. Use the `spaceless` filter instead or `{% filter spaceless %}`.

* Adding an `if` condition on a `for` tag is deprecated in Twig 2.10. Use a `filter` filter or an "if" condition inside the "for" body instead (if your condition depends on a variable updated inside the loop)

{% endraw %}