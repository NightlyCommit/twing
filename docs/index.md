## Twing Documentation

Read the online documentation to learn more about Twing.

<ul>
    {% for item in site.data.navigation_documentation.docs %}
        <li>
        {% if item.url %}
            <a href="{{ site.baseurl }}/{{ item.url }}" alt="{{ item.title }}">{{ item.title }}</a>
        {% else %}
            <span>{{ item.title }}</span>
        {% endif %}
        </li>
   {% endfor %}
   <li><a href="{{ site.github.repository_url }}/blob/master/LICENSE">License</a></li>
</ul>

## Twing Reference

Browse the online reference to learn more about built-in features.

<div>
    {% for section in site.data.navigation_reference.sections %}
    <h3>{{ section.title }}</h3>
    <ul>
        {% for item in section.items %}
            <li>
            {% if section.url %}
                <a href="{{ site.baseurl }}/{{ item.url }}" alt="{{ item.title }}">{{ section.title }}</a>
            {% else %}
                <span>{{ item.title }}</span>
            {% endif %}
            </li>
        {% endfor %}
    </ul>
    {% endfor %}
</div>
