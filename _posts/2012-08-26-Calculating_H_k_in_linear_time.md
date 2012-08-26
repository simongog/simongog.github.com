---
title: Calculating the k-th order empirical entropy in linear time
layout: sdslpost
category : lessons
tags : [sdsl, CST, entropy]
---
{% include JB/setup %}

In this post, I will explain how it is possible to efficiently
calculate different measures of text compressibility -- the zeroth
and \\(k\\)-th order empirical entropy -- using
[sdsl](http://github.com/simongog/sdsl). For both cases
we use a compressed suffix tree (CST) to do the calculation.
So step one is to build a compressed suffix tree of a
text file. This can be easily done with the following
code snippet:
<script src="http://gist.github.com/3355523.js"></script>
You can copy this program into the examples directory and
execute `make` to get an executable, which will
construct a CST for the file given by the first argument
to the program. Lets take for example the file 
`faust.txt` which is located in the libraries
test suite. A run of the program produces a CST 
names `faust.txt.cst3`. The CST has size 
460 kB for the original 222 kB. 


## 1 Calculating the zeroth order entropy

The zeroth order empirical entropy \\(H\_0\\) 
of a text \\(\TEXT\\) of length \\(n\\) 
over an alphabet \\(\Sigma=\\{c\_0,\ldots,c\_{\sigma-1}\\}\\) of size \\(\sigma \\) is a lower 
bound for a compressor which encodes each symbol with a 
fixed prefix code. It is defined as 

<div>
\[
H_0(\TEXT) = \sum\limits_{i=0}^{\sigma-1} \frac{n_i}{n} \log{\frac{n}{n_i}}
\]
</div>

where \\(n_i\\) is the number of occurrences of character 
\\(c_i\\) in \\(\TEXT\\). It is very easy to see that 
\\(n_i\\) corresponds to the size of subtree (e.g. number of
leaves in the subtree) rooted at the
\\(i\\)-th child of the root of the CST. The length of the
text \\(n\\) corresponds to the size of the whole tree.
Therefore, the following method calculates \\(H\_0(\TEXT)\\) 
if `v` is the root node of our CST: 

<script src="http://gist.github.com/3355768.js"></script>

The code is straightforward: If the root node is a leave, then
the tree and the text are empty and \\(H_0\\) should be 0.
Otherwise we recover \\(n\\) by determine the size of the
subtree of `v` and calculate the first child. We then add for
each child its weighted contribution to \\(H_0\\). Note:
`cst.sibiling(w)` returns the root node `cst.root()` if there
is no next sibling.

## 2 Calculating the k-th order entropy

<div>More advanced compressors make use of the context before 
a symbol and choose different prefix codes dependent on the preceding
context. Say, the length of the context is of fixed length \(k\) 
the \(k\)-th order empirical entropy \(H_k(\TEXT)\) is a lower
bound for compressors which encode each symbol by different
prefix codes which depend on the \(k\)-character context before
the symbol. Here is the formal definition:
   
\[
	H_k(\TEXT) = \frac{1}{n} \sum_{\omega\in \Sigma^k} |T_\omega|H_0(T_\omega)
\]

where \(T_\omega\) is the concatenation of all characters in \(\TEXT\)
which follow the occurrences of the substring \(\omega\) in \(\TEXT\).
Note that a brute-force calculation of \(H_k\) is expensive, since
there are many substrings \(\omega\) which do not
contribute to the result, since they do not occur in \(\TEXT\) and
therefore \(T_\omega\) is empty. Fortunately with a CST we can exactly
inspect those substrings which occur in the text and can also easily
calculate \(|T_\omega|\) and \(H_0(T_\omega)\). A substring of length
\(k\) is represented as a sequence of edges of length \(k\) in the CST.
If the substring is always followed by the same symbol \(c\) then there exists
no corresponding node for the substring in the CST. But in this case
\(H_0(T_\omega)=0\), since \(T_\omega\) consists only of \(c\)s. On the
oder hand if different occurrences of \(\omega\) are followed by different characters
then there exists a CST node \(v\) with depth \(k\). In this case  
\(|T_\omega|\) corresponds to the size of the subtree of \(v\) and
\(H_0(T_\omega)\) can be calculated by the algorithm from Section 1.
Here is the complete code:
</div>

<script src="http://gist.github.com/3473167.js"></script>

# Example

Lets look at an example. Say our string is \\(\TEXT\\)=`umulmundumulmu$` 
and we and to calculate \\(H\_1(\TEXT)\\).
Then the occurrences of substrings `d`, `l`, and `n` are always followed
by the same character and so they do not contribute to the result.
Have a look at the figure below to also note that all these substrings
are not represented by a node in the CST. `$` is represented by
a node but does also not contribute since it is a leaf node and
therefore \\(T\_{\$}\\) empty. We can also determine from the figure
that the substring `m` is followed by one `$` and four `u` and 
therefore adds \\(5H\_0(T\_m)\\) to the result. Note that the
actual order of characters in \\(T\_m\\) does not change
the result and it is enough to know the distribution of 
symbols. In our case \\([1,4]\\). Finally, we do the
same procedure also for substring `u`.

<div style="text-align:center;width:100%;">
<img alt="k-th order entropy calculation with a suffix tree" 
     src="/assets/images/kth_order_entropy_calculation_suffix_tree.png"></image>
</div>

# Experiment 

Lets take the 200 MiB test cases of the 
[Pizza&amp;Chili](http://pizzachili.di.unipi.it/)
corpus build the CST with the program above and calculate
\\(H_0,\ldots,H_10 \\) with this program:
<script src="http://gist.github.com/3476809.js"></script>

Voil&#225;, here is the result:

<div style="text-align:center;width:100%;">
<img alt="k-th order entropy calculation with a suffix tree" 
     src="/assets/images/kth_order_entropy_results_pizza_chili_200MB.png"></image>
</div>

In one of the next posts, I will show that we can reach about \\(H_4\\) 
in practice. If we choose larger values for \\(k\\) then the 
number of contexts \\(CT\\) is so high, that the information
which is needed to store context information dominates the space.

## References

 * {% cite_details manzini99soda, Manzinis SODA article %} and 
 * {% cite_details navmak07, the full-text index overview article of Navarro and M&auml;kinen %}.
 * The figure and algorithms were also used as an example in my {% cite_details gog2011phd, thesis %}.


