#!/usr/bin/perl -w
no warnings "recursion";

use Graph;

open(f_Input, $ARGV[0])||
    die("cannot open file");
$output = ">".$ARGV[1];
open(f_Output, $output);

$seq = NULL;

#how many times do you want to permutate;
$number = 100;

#criteria
$eng_cutoff = -15;
$match_cutoff = 18;
$len_cutoff = 55;


for($num_mut = 0;$num_mut < $number; $num_mut++){
    seek(f_Input, 0, 0);
    $count = 0;
    $good = 0;
    $mir_id = <f_Input>;
    until(eof(f_Input)){
	$count ++;
	$seq = <f_Input>;
	$seq =~ tr/T/U/;
	chop $seq;
	$perm_seq = dinucleotide_shuffle($seq);
	#print $seq,"\n",$perm_seq,"\n";
	if(evaluate($perm_seq)){
	    $good ++;
	}
	$mir_id = <f_Input>;
    }
    print f_Output ">Exp$num_mut\t$good\t$count\n";
}

sub evaluate{
    my $seq = shift;
    my $line = `echo -n $seq | ./RNAfold`;
    $line = (split(/\n/, $line))[1];
    my $foldsub = NULL;
    $seq =~ tr/AUCG/aucg/;
    #good energy and no multiloop?
    my $energy = 0;
    my $ifgood = 0;
    my $start = 0;
    my $end = 0;
    my $i=0;my $j = 0;
    my $sub = '';
    my $prob = 0;
    $hairpin = ">".(split(/\s+/, $line))[0]."<";
    @hairpin = split(//, $hairpin);
    while($hairpin =~ /(\(\.+\))/g){
	$end = pos($hairpin)-1;
	$start = $end - length($1) + 1;
	while(1){
	    $i = 1;$j = 1;
	    while($hairpin[$start-$i] eq "."){
		$i ++;
	    }
	    if($hairpin[$start-$i] eq "("){
		while($hairpin[$end+$j] eq "."){
		    $j ++;
		}
		if($hairpin[$end+$j] eq ")"){
		    $start = $start-$i;$end = $end+$j;
		}else{
		    last;
		}
	    }else{
		last;
	    }
	}
	$start--;$end--;
	$sub = substr($seq, $start, $end-$start+1);
	if(length($sub) >= $len_cutoff){
	    $foldsub = `echo -n $sub| ./RNAshapes -q -c 5.0 -F 0.02 -M 20 -m [] -o 1`;
	    if($foldsub !~ /not/){
		#judge if this chunk is a good hairpin based on energy etc.
		$energy = (split(/\s+/, $foldsub))[2];
		chop $energy; substr($energy, 0,1) = '';
		$prob = (split(/\s+/, $foldsub))[3];
		$_ = (split(/\s+/, $foldsub))[1];
		$match = tr/\(/\(/;
		if($prob >= 0.85 && $energy <= $eng_cutoff && $match >= $match_cutoff){
		    $ifgood = 1;
		    print $mir_id;
		    print substr($seq, 0, $start)."---".substr($seq, $start, $end-$start+1)."---".substr($seq, $end+1),"\n";
		    print substr($line, 0, $start)."---".substr($line, $start, $end-$start+1)."---".substr($line, $end+1),"\n";
		    print $foldsub,"\n";
		}
	    }
	}
    }
    return $ifgood;
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
