#!/usr/bin/perl -w 

# permutations
# This script prints out all permutations of the strings supplied
# as command-line arguments.
# The recursive subroutine 'permut' is from the "Perl Cookbook"
# and was written by Tom Christiansen.
# The algorithm is apparently the usual one used by Lisp programmers.
# Note that the Perl Cookbook also supplies an alternative algorithm 
# that is faster and more flexible, but this one is shorter.
# Cameron Hayne (macdev@hayne.net)  May 2005

permut([@ARGV], []);

sub permut
{
    # the two parameters to this function are references to the arrays
    # of items to be permuted and the permutations calculated so far
    my @items = @{ $_[0] };
    my @perms = @{ $_[1] };

    unless (@items)
    {
        # stop recursing when there are no elements in the items
        print "@perms\n";
    }
    else
    {
        # for all elements in @items, move one from @items to @perms
        # and call permut() on the new @items and @perms
        my (@newitems, @newperms, $i);
        foreach $i (0 .. $#items)
        {
            @newitems = @items;
            @newperms = @perms;
            unshift(@newperms, splice(@newitems, $i, 1));
            permut([@newitems], [@newperms]);
        }
    }
}
