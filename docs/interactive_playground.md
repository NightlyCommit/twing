Interactive Playground
======================

<div class="playground" data-initial-value="{% raw %}{% set world = 'world' %}
Hello {{ world }}!{% endraw %}"></div>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.44.0/codemirror.min.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.44.0/addon/fold/foldgutter.min.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.44.0/codemirror.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.44.0/mode/twig/twig.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.44.0/mode/javascript/javascript.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.44.0/addon/fold/foldcode.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.44.0/addon/fold/foldgutter.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.44.0/addon/fold/brace-fold.min.js"></script>
<script src="/twing/assets/twing.min.js"></script>
<script src="/twing/assets/json-stringify-safe.js"></script>
<link rel="stylesheet" href="/twing/assets/playground.css">
<script src="/twing/assets/playground.js"></script>
<script>
let playground;
document.addEventListener('DOMContentLoaded', function() {
    playground = new Playground(document.querySelector('.playground'));
}, false);
</script>

[back][back-url]

[back-url]: {{ site.baseurl }}{% link index.md %}
