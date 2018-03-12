## Twing Documentation

Read the online documentation to learn more about Twing.

<ul>
    {% for item in site.data.navigation_documentation.docs %}
        <li>
        {% if item[1].url %}
            <a href="{{ site.baseurl }}/{{ item[1].url }}" alt="{{ item[1].title }}">{{ item[1].title }}</a>
        {% else %}
            <span>{{ item[1].title }}</span>
        {% endif %}
        </li>
   {% endfor %}
   <li><a href="{{ site.github.repository_url }}/blob/master/LICENSE">License</a></li>
</ul>

## Twing Reference

Browse the online reference to learn more about built-in features.

<div>
    {% for section in site.data.navigation_reference.sections %}
    <h3>{{ section[1].title }}</h3>
    <ul>
        {% for item in section[1].items %}
            <li>
            {% if item[1].url %}
                <a href="{{ site.baseurl }}/{{ item[1].url }}" alt="{{ item[1].title }}">{{ item[1].title }}</a>
            {% else %}
                <span>{{ item[1].title }}</span>
            {% endif %}
            </li>
        {% endfor %}
    </ul>
    {% endfor %}
</div>
