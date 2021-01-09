##############################
#! /usr/bin/perl
#  Created Aug 30th 2007
#  To predict the best match
#  to pwm in mel and sim
#  
#  Modified Sep 11th 2007
#  To summarize the changes
#
#  Hebin
##############################


use DBI;
prepareDbh();
#$dbh->do(qq{truncate table tfbs_poly});
open(f_Output, ">binding_sites_analysis");
open(f_Record, ">sup_binding_sites_analysis.txt");
open(f_Complicate, ">complicate_binding_sites_analysis.txt");
die "Cannot open filename\n" unless open (f_File, "filename");
$filename = <f_File>;
chomp $filename;

##initialize variables;

$flank = 5;
$total = 0;#store the total number of sites checked that also has a valid pwm;
$status = ''; #status can be one of "conserved, loss, preferred, unpreferred;
$shift = 0; $shift_freq = 0; $loss = 0; $status = ''; $scorechange = 0; $scorechange_freq = 0;$alleles = 0;
@species = ('mel', 'c1674', 'md106', 'md199', 'newc', 'sim46', 'w501');

####################
# Pick up a region #
####################
while(!eof(f_File)){
    ($region, $chr_arm, $region_start, $region_end) = (split(/\.|\-/, $filename))[0,1,2,3];
    die "cannot open file $filename" unless open(f_Input, $filename);
    $desc = `grep "$region" regions_annotation.txt`;
    $desc =~ tr/\t/\n/;
    print f_Record "Summary\n--------\n$desc--------\n";print f_Complicate "Summary\n--------\n$desc--------\n";
    print $region,"\n";
    (@line) = ();
    for($i = 0; $i < 7; $i ++){
	<f_Input>;
	$line[$i] = <f_Input>;
	chomp $line[$i];
    }

    ####################
    # Retrieve all the 
    # binding sites
    # location
    ####################
    $sth = $dbh -> prepare(qq(select e.region as region, t.* 
			      from enhancer as e, tfbs as t 
			      where e.region = '$region' AND t.chr_arm = e.chr_arm AND t.tfbs_start between e.start and e.end order by t.tfbs_id));
    $sth -> execute();
    (@array) = ();
    while(@array = $sth -> fetchrow_array()){
	$patser_seq = '';
	$align_seq = '';
	($region,$tfbs_id, $chr_arm, $factor, $target, $fp_start, $fp_end) = @array[0..6];
	##################
	# flanking sites #
	##################
	if(($fp_start-$region_start) >= $flank){#get the footprinted sites with 5bp flanking;
	    $prefix = $flank;
	}else{
	    $prefix = $fp_start - $region_start;
	}
	if(($region_end - $fp_end) >= $flank){
	    $suffix = $flank;
	}else{
	    $suffix = $region_end - $fp_end;
	}
	######################
	# Retrieve sequences #
	######################
	### First: retrieve the reference sequence ###
	$line = $line[0];
	$line =~ tr/\-//d;
	$seq{'mel'} = substr($line, $fp_start - $region_start - $prefix, $fp_end - $fp_start + $prefix + $suffix);

	for($i = 0; $i < 7; $i ++){
	    $line = <f_Input>;
	    $line = <f_Input>;#get the sequence;
	    #$seq{$species[$i]} = substr($line, $start, $span);
	    $seq{$species[$i]} = lc(substr($line, $start-$region_start, $prefix)).
		                 substr($line, $fp_start-$region_start, $fp_end-$fp_start+1).
		                 lc(substr($line, $fp_end-$region_start+1, $suffix));
	    if($seq{$species[$i]} =~ /N|n/){
		next;
	    }
	    $patser_seq = $patser_seq.$species[$i]."\t\\".$seq{$species[$i]}."\\\n";
	}
	############
	#  Patser  #
	############
	if(-e "/Users/hebin/Documents/tfbs/OptimalPatserMatrices/".$factor){
	    $result = `echo -n '$patser_seq' | 
                       ~/Documents/tfbs/patser/patser-v3b -A a:t 0.3 c:g 0.2 -m ~/Documents/tfbs/OptimalPatserMatrices/$factor -b 1 -d2 -c -t |
                       grep "width of the alignment matrix:\\|position="`;
	}else{
	    next;
	}
	next if($result !~ /position=/);
	$total ++;#count the total number of sites examined with a valid pwm

	$result =~ /width of the alignment matrix:\s+(\d+)/;
	$width = $1;
	@position = $result =~ /position=\s+(\d+C?)\s+/g;
	@score = $result =~ /score=\s+(\S+)/g;
	$k = 0;#the index for @position;
	(@motif) = ();
 	for($i = 0; $i < 7; $i ++){
	    $sign = ">";#default direction is on the direct strand, "<" for reverse strand;
	    if($seq{$species[$i]} =~ /n|N/){next;}#rule out any incomplete sequences;
	    #####################
	    #  Format printing  #
	    #####################
	    if($i == 0){
		$align_seq = $species[$i]."\t".$seq{$species[$i]}."\n";
	    }else{
		$align_seq = $align_seq.$species[$i]."\t".align($seq{$species[$i]})."\n";
	    }
	    if($result !~ /$species[$i]/){
		$loss ++;
	    }else{
		$seq_nogap = $seq{$species[$i]};
		$seq_nogap =~ tr/\-//d;
		$motif[$k] = substr($seq_nogap, $position[$k]-1, $width);
		if($position[$k] =~ /C/){
		    $position[$k] =~ tr/C//d;
		    $sign = "<";
		}
		$align_seq .= "\t";
		$j = 0;$jj = 0;#$j coresponds to the position in the seq;$jj counts the number of non gap nt;
		for($j = 0; substr($seq{$species[$i]}, $j, 1) eq '-';$j ++){
		    $align_seq .= " ";
		}
		while($jj < $position[$k]-1){
		    if(substr($seq{$species[$i]}, $j, 1) ne '-'){
			$jj ++;
		    }
		    $align_seq .= " ";
		    $j ++;
		}
		$jj = 0;#$jj record the number of non-gap nt;
		while($jj < $width){
		    if(substr($seq{$species[$i]}, $j, 1) ne '-'){
			$jj ++;
		    }
		    $j ++;
		    $align_seq .= $sign;
		}
		$k ++;
	    }
	    $align_seq .= "\n";
	    #end marking;
	}
	$num_alleles = compstr(@motif);
	#rule out cases of complications;
	$shift = 0;#indicator of bs shift;
	for($i = 0; $i < 7; $i ++){
	    $temp = $result =~ s/$species[$i]/$species[$i]/eg;
	    if($temp > 1){
		print f_Complicate $factor,"\n\t1   5    10   15   20 \n";
		print f_Complicate $align_seq;
		print f_Complicate $result;
		#$sign = <STDIN>;
		#chop $sign;
		#if($sign eq 'q'){last;}
		last;
	    }
	}
	##############
	#  analysis  #
	##############
	if($i == 7 && $num_alleles <= 2){
	    #get the status;
	    foreach(@position){
		if(($_ - $position[0]) != 0){
		    $shift = $_ - $position[0];
		    $shift_freq ++;
		}
	    }
	    foreach(@score){
		if(($_ - $score[0]) != 0){
		    $scorechange = $_ - $score[0];
		    $scorechange_freq ++;
		}
	    }
	    if($num_alleles == 1){
		$status = "conserved";
	    }elsif($scorechange > 0){
		$status = "preferred";
	    }elsif($scorechange < 0){
		$status = "unpreferred";
	    }else{
		$status = "undef";
	    }
	    $alleles = $loss + scalar(@motif);
	    print f_Output "$tfbs_id\t$factor\t$score[0]\t$alleles\t$loss\t$shift\t$shift_freq\t$status\t$scorechange\t$scorechange_freq\n";
	    if($status ne 'conserved'){
		print f_Record $factor,"\n\t1   5    10   15   20 \n";
		print f_Record $align_seq;
		print f_Record $result;
	    }
	}
	######################
	# Restore parameters #
	######################
	$shift = 0; $shift_freq = 0; $loss = 0; $status = ''; $scorechange = 0; $scorechange_freq = 0;$alleles = 0;
    }
    
    $sth -> finish();
    $filename = <f_File>;
    chomp $filename;
}
$dbh -> disconnect;
print "$dualtop / $total\n";

sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}
sub align
{
    my $seq = shift;
    my (@seq) = split(//, $seq);
    my (@ref) = split(//, $seq{'mel'});
    my $length = length($seq);
    my $i = 0;
    for($i = 0; $i < $length; $i ++){
	if($seq[$i] eq $ref[$i]){
	    $seq[$i] = '.';
	}
    }
    return join("", @seq);
}

sub compstr
{
    my @seq = @_;
    my $num = scalar(@seq);
    my (@seq2) = ();
    my $p = 0;
    my $i = 0;
    my $j = 0;
    $seq2[0] = $seq[0];#mel;
    for($i = 1; $i < $num; $i ++){
	for($j = 0; $j <= $p; $j ++){
	    if($seq[$i] eq $seq2[$j]){
		last;
	    }
	}
	if($j > $p){
	    $seq2[$p + 1] = $seq[$i];
	    $p ++;
	}
    }
    return $p+1;
}
