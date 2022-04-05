
## Initial brute force algorithm

The simplest method to find all sets would be to check every triple among all
the cards. There are (n choose 3) triples in n cards, which means that the run time is O(n^3).
 (show code)

Another idea could stem from the fact that for every 2 cards there is exactly
one other card that completes the set. So we can find all pairs in n cards (n
choose 2) and for each pair calculate which card is missing from to complete
that set. In order to check if that third pair is currently on the board we can
store all the cards in a hashmap and then lookup is O(1). (I guess if n is
small enough no need to hash it. Just fill a regular old array which has length
of total number of cards and fill that array based on what is on the table.
More space but no need for hashing stuff. Also hashing in JavaScript looked a
bit wonky). Anyways, now the run time is O(n^2) which is better. For the standard 12 cards this means 66 pair-wise checks

It turns out that this runtime is the best asymptotic run time we can achieve

### HOWEVER

We can improve the runtime even if it stays the same asymptotically

Let's consider the complete graph G_0 with n nodes (1 node corresponds to 1
card on the table). Every triple of cards is some triangle in the graph. Every
check on a pair of cards we do can be thought of as removing that edge from the
graph. The question is at what point can we be sure that there are no more
triangles in the graph. 

### Turan's Theorem

Places an upper bound on the number of edges in a graph that has no k-cliques.
(A k-clique is a complete subgraph of size k). 

In the specific case of 3-cliques (i.e. triangles), we arrive at the conclusion
that the max number of edges is n^2 / 4.


### The Punchline

The graph G_0 has n(n-1)/2 edges. Therefore we need to do maximum [n(n-1) / 2]
- [n^2 / 4] checks in order to get down to a state where we know that there are
possible sets to check. This comes out to [n^2 / 4] - [n / 2].

Now that we know that such an algorithm exists, how do we go about finding out
what it is. A subtle hint could be if we notice that 
[n^2 / 4] - [n / 2] == (n/2)(n/2 - 1). That looks suspiciously like the formula
for n(n-1)/2 which gives us the number of pairs in n. So we know that we may be
wanting to look for pairs in half of of the cards. Now why would that be? 

Consider the following. If we split the array of cards in half, and we seek some triple in the array, then we know that at least 2 out of 3 of the cards are on one side or another of the split. ( It either looks like [1,2,3?]|[3?] or [3?]|[1,2,3?]). So if we find all the pairs in one half of the array and check if the necessary third card exists in the array (hashset) at all then we have covered half the possibilities. Then we just reverse them and check the other half then we have checked all triples.

[pseudo code]

For the standard 12 cards, this means 30 pair-wise checks, less then half of the original

Again, these improvements only work if you have O(1) lookup to see if a card exists on the board
