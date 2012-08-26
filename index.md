---
layout: page
title: Index page 
---
{% include JB/setup %}

About five year ago, I have read an article about so called
succinct data structures and was fascinated. These succinct
data structures only use space close to the information theoretic
lower bound of the underlaying object while providing the
same functionality as a classical uncompressed data structure.
For example a tree with \\(n\\) leaves can be represented in about 
\\(2n\\) bits and still answer the operations `parent`, `child` and `sibling`
in constant time. The uncompressed tree data structure 
would take pointers of size \\(\\log n\\) for each node 
and would be therefore significantly larger in practice. 


However, in practice the classical data structures
are often orders of magnitudes faster since operations
in succinct data structures require often multiple
random accesses to different sub data structures.
Another drawback is that succinct data structures
are not easy to implement. Each bit has to be in
the right place and there were no libraries
which contain basic succinct structures like
a bit vector and rank and select structures.

This was the motivation to design a easy to use
(if you know the STL, it will be easy) but at
the same time highly efficient library for
succinct data structures. The result is simply
called [sdsl](https://github.com/simongog/sdsl)
and you are only one click away.

Blog entries: 
<ul class="posts">
{% for post in site.posts %}
<li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
{% endfor %}
</ul>



