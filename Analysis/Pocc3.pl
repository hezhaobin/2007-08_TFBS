########################
# June 29th 08
# To calculate Pocc for 
# enhancers as well as
# a p-value from per-
# muted sequences
# hebin
########################

use warnings;
no warnings "recursion";
use Graph;
$factor = 'Kr';
$pwml = 10;
$ref = 10.74;#patser score for consensus sequence;
$iteration = 1000;

###############
# loading pwm #
###############
open f_Input, "../OptimalPatserMatrices/weight_matrix.txt" ||
    die "Cannot open weight_matrix.txt";
while(!eof(f_Input)){
    $line = <f_Input>;
    $line =~ /Matrices\/(\S+)\"\:\ (\d+)/;
    $factor = $1; $width = $2;
    (@$factor) = ();
    <f_Input>;
    for($i = 0; $i < $width; $i ++){
	$line = <f_Input>;
	(@array) = ();
	@array = split(/\s+/, $line);
	$array[0] ne '' || shift(@array);#discard the first empty element;
	push(@$factor, @array);
    }
    #print "$factor uploaded\n";
    <f_Input>;
}
close(f_Input);

$factor = 'Kr';

open f_File, "./fasta/Kr_test.fasta";
while($line = <f_File>){
    $line =~ /\\(\S+)\\/;
    $seq = $1;#input enhancer sequence;
    $Pocc = 0;
    $Pocc = Pocc($seq);
    $count = $pvalue = 0;
    for $k(1..$iteration){
	$shuffle = '';
	$shuffle = dinucleotide_shuffle($seq);
	$Pocc_shuffle = 0;
	$Pocc_shuffle = Pocc($shuffle);
	$count ++ if ($Pocc_shuffle > $Pocc);
    }
    $pvalue = $count/$iteration;
    print "Pocc = $Pocc\tp-value = $pvalue\n";
}

sub Pocc
{
    my $seq = shift;
    ##################
    # sliding window #
    ##################
    my (@Pi) = ();
    for my $i(0..(length($seq)-$pwml)){
	my $window = substr($seq, $i, $pwml);
	my $plus = $window;
	$plus =~ tr/ACGT/0123/;
	my $minus = revcomp($window);
	$minus =~ tr/ACGT/0123/;
	my $splus = my $sminus = 0;
	for $j(0..($pwml-1)){
	    $splus += $$factor[4*$j+substr($plus, $j, 1)];
	    $sminus += $$factor[4*$j+substr($minus, $j, 1)];
	}
	my $score = $splus >= $sminus ? $splus:$sminus;
	my $Pi = 0;
	$Pi = 1/(exp($ref-$score)+1);
	@Pi = (@Pi, $Pi);
    }
    my $Pocc = 0;
    my $product = 1;
    for $Pi(@Pi){
	$product = $product * (1-$Pi);
    }
    $Pocc = 1-$product;
    return $Pocc;
}

sub revcomp
{
    my $seq = shift;
    $seq =~ tr/ACGT/TGCA/;
    return join('',reverse(split(//, $seq)));
}

#############################################################################
#dishuffleseq.pl
#This program is an implementation of the Altschul&Erickson algorithm
#for exact dinucleotide shuffling.
#Altschul SF & Erickson BW. 1985. Mol. Biol. Evol. 2(6):526-538
#Adjacency lists
#http://www2.toki.or.id/book/AlgDesignManual/BOOK/BOOK2/NODE61.HTM
#Only ACGT are allowed
#Copyright (c) 2005-2006 Diego Mauricio Ria?¡Ào Pach?3n
#http://www.geocities.com/dmrp.geo
#
#This program is free software; you can redistribute it and/or
#modify it under the terms of the GNU General Public License
#as published by the Free Software Foundation; either version 2
#of the License, or (at your option) any later version.
#
#This program is distributed in the hope that it will be useful,
#but WITHOUT ANY WARRANTY; without even the implied warranty of
#MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#GNU General Public License for more details.
#
#You should have received a copy of the GNU General Public License
#along with this program; if not, write to the Free Software
#Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
#############################################################################

sub dinucleotide_shuffle{
    my $seq=shift;
    my @seq_bases=split(//,$seq);
    #The last nucleotide is necesary to check 
    #the connectivity of the last edges set
    my $last_vertex=$seq_bases[-1];
    #The first nucleotide of the original sequence,
    #will be the first in the random sequence
    my $first_nucleotide=$seq_bases[0];
    my %nodes;
    my %edges;
    my %new_edge_set;
    #Create the list of dinucleotides present in seq
    for (my $i=0;$i<@seq_bases-1;$i++){
	$edges{$i}=$seq_bases[$i].$seq_bases[$i+1];
	push @{$nodes{$seq_bases[$i]}},$i;#This is and adjacency list
    }
    my $continue=0;
    #Search for a good set of last edges
    #(a connected graph of last edges)
    while($continue==0){
	my @last_edges=&create_last_edge_set(\%nodes,\%edges,\$last_vertex);
        #Test if the set of last edges are conected to the last_vertex
	$continue=&test_graph_Z(\@last_edges,\$last_vertex,\%nodes,\%edges);
	if ($continue==1){
	    foreach my $node(sort keys %nodes){
		my $last_edge=&get_last_edge(\@last_edges,\$node);
		my $first_apparison_last_edge=0;
		my @new_edge_list_without_last_edge=();
                #Eliminate the last edge for the current node,
                #creating a new list without the last edge,then go to permute
		foreach my $edge_indx(@{$nodes{$node}}){
		    if ($edges{$edge_indx} eq $last_edge && $first_apparison_last_edge==0){
			$first_apparison_last_edge=1;
		    }
		    else{
			push @new_edge_list_without_last_edge,$edges{$edge_indx};
		    }
		}
                #Create a random permutation of the remaining edges
		&fisher_yates_shuffle(\@new_edge_list_without_last_edge) if @new_edge_list_without_last_edge>0;
		if ($last_edge){
                    #Add the last edge to the random permutation
		    push @new_edge_list_without_last_edge,$last_edge;
		}
#		print "$node\t@new_edge_list_without_last_edge\n";
		$new_edge_set{$node}=\@new_edge_list_without_last_edge;
	    }
	    my @random_seq=();
	    &generate_random_seq(\$first_nucleotide,\%new_edge_set,\@random_seq);
	    my $random_seq=join('',@random_seq);
	    return $random_seq;
	}
    }
}

sub generate_random_seq{
    my ($nuc,$random_edge_set_hashref,$random_seq_arrayref)=@_;
    push @$random_seq_arrayref,$$nuc;
    #Check if there are vertices for current node, sometimes there aren't
    #for example when the only aparison of a node is at the end of a secuence
    #in that case there are not edges for that node.
    if (defined(@{$$random_edge_set_hashref{$$nuc}}) && @{$$random_edge_set_hashref{$$nuc}}>0){
	my ($nuc_a,$nuc_b)=split(//,${$$random_edge_set_hashref{$$nuc}}[0]);
	splice(@{$$random_edge_set_hashref{$$nuc}},0,1);#Delete traversed edge
	&generate_random_seq(\$nuc_b,$random_edge_set_hashref,$random_seq_arrayref);
    }
    else{
        #Delete node when all edges from this node have been traversed
	delete $$random_edge_set_hashref{$$nuc};
    }
    return $random_seq_arrayref;
}

sub fisher_yates_shuffle {
    #Perl Cookbook Section 4.17. Randomizing an Array
    my $array = shift;
    my $i;
    for ($i = @$array; --$i; ) {
        my $j = int rand ($i+1);
        next if $i == $j;
        @$array[$i,$j] = @$array[$j,$i];
    }

    return $array;
}

sub get_last_edge{
    my ($last_edges,$node)=@_;
    foreach my $edge(@$last_edges){
	if ($edge=~/^$$node\w$/){
	    return $edge;
	}
    }
}

sub test_graph_Z{
 #Z is the last-edge graph
 #According to [Altschul&Erikson,1985]
 #if any vertex is not connected in Z to the last
 #base in the original sequence, then the new edge 
 #set will not be eulerian, and a new set of last 
 #edges must be chosen.

 #Passing the set of last edges, and the last base in the sequence
 my ($edges, $last_vertex,$nodesref,$edgesref)=@_;
 my $Z = Graph->new(directed => 1);
 foreach my $edge(@$edges){
  my ($first,$second)=split(//,$edge);
  #Creating the directed graph Z
  $Z = $Z->add_edge($first, $second);
 }
 #Extracting the vertices  (nodes) in Z
 my @V_z = $Z->vertices;
 my $count_vertex=0;
 my $count_connected=0;
 foreach my $vertex(@V_z){
  #It is not necessary to visit the last vertex
  if($vertex ne $$last_vertex){
   $count_vertex++;
   #Can you go from a given vertex to last vertex?
   my $connected=$Z->is_reachable($vertex,$$last_vertex);
   if (!$connected || $connected==0){}
   else{
    #if yes, add one to the count of connected vertex
    $count_connected++;
   }
  }
 }
 if ($count_vertex==$count_connected){
  #If all vertices in Z are connected to the last base,
  #then the count of vertices (excluding the last one)
  #should be equal to the count of connected vertices
  #then this is a good last-edges set
  return 1;
 }
 else{
  return 0;
 }
}

sub create_last_edge_set{
    my ($nodesref,$edgesref,$last_vertex)=@_;
    my @last_edges_set=();
    foreach my $node(sort keys %$nodesref){
	if($node ne $$last_vertex){
	    my $index   = int rand @{$$nodesref{$node}};
	    push @last_edges_set, $$edgesref{${$$nodesref{$node}}[$index]};
	}
    }
    return @last_edges_set;
}

sub validate_seq{
    my $seq_to_validate=shift;
    $seq_to_validate=~s/ //g;
    $seq_to_validate=uc($seq_to_validate);#Everything to uppercase
    $seq_to_validate=~s/U/T/g;#U will be replaced by T
    if ($seq_to_validate=~/[^ACGTN]+/){
	my @result=($seq_to_validate,'0');
	return @result;
    }
    else{
        my $seq_trimmed=&trim_sequence(\$seq_to_validate);
	my @result=($seq_trimmed,'1');
	return @result;
    }
}

sub trim_sequence{
    #The sequence should end in a base ACGTU,
    #N is not allowed and it will be removed.
    my $seq_to_trim=shift;
    my @bases=split(//,$$seq_to_trim);
    if ($bases[-1] eq 'N'){
	pop @bases;
	my $seq=join('',@bases);
	&trim_sequence(\$seq);
    }
    else{
	return $$seq_to_trim;
    }
}
