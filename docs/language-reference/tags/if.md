`if`
====

{% raw %}

In the simplest form you can use the `if` statement to test if an expression evaluates to `true`:

````twig
{% if online == false %}
    <p>Our website is in maintenance mode. Please, come back later.</p>
{% endif %}
````

You can also test if an array is not empty:

````twig
{% if users %}
    <ul>
        {% for user in users %}
            <li>{{ user.username|e }}</li>
        {% endfor %}
    </ul>
{% endif %}
````

> If you want to test if the variable is defined, use `if users is defined` instead.

You can also use `not` to check for values that evaluate to `false`:

````twig
{% if not user.subscribed %}
    <p>You are not subscribed to our mailing list.</p>
{% endif %}
````

For multiple conditions, `and` and `or` can be used:

````twig
{% if temperature > 18 and temperature < 27 %}
    <p>It's a nice day for a walk in the park.</p>
{% endif %}
````

For multiple branches `elseif` and `else` can be used. You can use more complex `expressions` there too:

````twig
{% if kenny.sick %}
    Kenny is sick.
{% elseif kenny.dead %}
    You killed Kenny! You bastard!!!
{% else %}
    Kenny looks okay --- so far
{% endif %}
````

> Here are the edge cases of Twig comparison rules:

````
====================== ====================
Value                  Boolean evaluation
====================== ====================
empty string           false
numeric zero           false
NAN (Not A Number)     true
INF (Infinity)         true
whitespace-only string true
string "0" or '0'      false
empty array            false
null                   false
non-empty array        true
object                 true
====================== ====================
````

{% endraw %}

[back]({{ site.baseurl }}{% link language-reference/tags/index.md %})