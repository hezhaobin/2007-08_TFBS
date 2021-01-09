################################
#  perl Count_variations.pl
#  Created Apr 2nd 2008
#  To count number of variants
#  in best match to PWM region
#  Hebin
################################


use warnings;
use DBI;
prepareDbh();


####################
# Pick up a factor #
####################
open f_Input, "/Users/hebin/Documents/tfbs/OptimalPatserMatrices/PWMname.txt";
open f_Output, ">/Users/hebin/Documents/tfbs/Result/Effect_of_substitution.txt";
while($factor = <f_Input>){
    chomp $factor;
    #print "Examine $factor\n";
    $sth = $dbh -> prepare(qq(select fpid, region, chr_arm, tfbs_start, tfbs_end, tfbs_score, fp_start, fp_end
			      from tfbs 
			      where factor = '$factor' AND tfbs_score is not NULL order by region));
    $sth -> execute;
    (@array) = ();
    while(@array = $sth -> fetchrow_array){
	$query = (qq(select mel, yak, anc, sim_alleles, coordinate, polytype, poly_Or_not
		     from tfbs_poly
		     where region = '$array[1]' AND chr_arm = '$array[2]' AND coordinate between $array[3] and $array[4]));
	$sth2 = $dbh -> prepare($query);
	$sth2 -> execute;
	(@array2) = ();
	($mel, $yak, $anc) = ('','','');
	(@sim) = ('','','','','','');
	(@polytype) = ();
	(@poly_Or_not) = ();
	while(@array2 = $sth2 -> fetchrow_array){
	    $mel = $mel.$array2[0];
	    $yak = $yak.$array2[1];
	    $anc = $anc.$array2[2];
	    (@temp) = ();
	    @temp = split(/\s+/, $array2[3]);
	    for $i(0..5){
		$sim[$i] = $sim[$i].$temp[$i];
	    }
	    @polytype = (@polytype, $array[5]);
	    @poly_Or_not = (@poly_Or_not, $array[6]);
	}
	#discard gapped sites;
	if(join('',@polytype) =~ /indel/){
	    next;
	}
	#evaluate each evolutionary change;
	for $i(0..(scalar(@poly_Or_not)-1)){
	    $ancseq = $evoseq = $type = $coor = $effect = $freq = $allele = '';
	    if($poly_Or_not[$i] eq 'div'){
		#determine the lineage of the change;
		if(substr($anc, $i, 1) eq '?'){#ambiguous;
		    $type = 'Amb';
		    $ancseq = $mel;
		    $evoseq = $mel;
		    substr($evoseq, $i, 1) = substr($sim[0], $i, 1);
	    }elsif($poly_Or_not eq 'poly'){
	    }else{
	    }
	(@sim2) = ();
	for $i(0..5){
	    @sim2 = (@sim2, $sim[$i]) if $sim[$i] !~ /N/;
	}
	$alleles = scalar @sim2;
	$sth2->finish;
	########################################
	# determine the effect of each change  #
	########################################
	$ancpatser = $anc;
	$ancmel = '';
	$ancsim = '';
	$score = $score1 = $pvalue = $pvalue1 = '';
	if ($ancpatser =~ /\?/){
	    $ancmel = $ancsim = $ancpatser;
	    while($ancpatser =~ /\?/g){
		$pos = pos($ancpatser) - 1;
		substr($ancmel, $pos, 1) = substr($mel, $pos, 1);
		$j = 0;
		until(substr($sim2[$j], $pos, 1) ne 'n'){$j++;}
		substr($ancsim, $pos, 1) = substr($sim2[$j], $pos, 1);
	    }
	    $patser_seq  = 'mel'."\t\\".$ancmel."\\\n";
	    $result = `echo -n '$patser_seq'|
                       ~/Documents/tfbs/patser/patser -A a:t 0.3 c:g 0.2 -m ~/Documents/tfbs/OptimalPatserMatrices/$factor -b 1 -t -s -c|
                       grep 'position'`;
	    $result =~ /score\=\s+(\S+)\s+\S+\s+(\S+)/;
	    #print "$1\t$2\n";
	    $score = $1;$pvalue = $2;
	    $patser_seq  = 'sim'."\t\\".$ancsim."\\\n";
	    $result = `echo -n '$patser_seq'|
                       ~/Documents/tfbs/patser/patser -A a:t 0.3 c:g 0.2 -m ~/Documents/tfbs/OptimalPatserMatrices/$factor -b 1 -t -s -c|
                       grep 'position'`;
	    $result =~ /score\=\s+(\S+)\s+\S+\s+(\S+)/;
	    #print "$1\t$2\n";
	    if(abs($1-$score) >= 1){#if diff <= 1, then just use mel;
		$score1 = $1;$pvalue1 = $2;
	    }
	}else{
	    $patser_seq = 'anc'."\t\\".$ancpatser."\\\n";
	    $result = `echo -n '$patser_seq'|
                       ~/Documents/tfbs/patser/patser -A a:t 0.3 c:g 0.2 -m ~/Documents/tfbs/OptimalPatserMatrices/$factor -b 1 -t -s -c|
                       grep 'position'`;
	    $result =~ /score\=\s+(\S+)\s+\S+\s+(\S+)/;
	    #print "$1\t$2\n";
	    $score = $1;$pvalue = $2;
	}
	$yak = align($yak, $mel);
	$anc = align($anc, $mel);
	for $i(0..($alleles - 1)){
	    $sim2[$i] = align($sim2[$i], $mel);
	}
	#print "$array[0]\t$array[5]\n";
	#print "anc\t$anc\nyak\t$yak\nmel\t$mel\nsim\t", join("\n\t", @sim2), "\n";
	if($array[5] < 0){
	    $array[5] = -1;
	}
	if($score < 0 || $score eq ''){
	    $score = -1;$pvalue = 0;
	}
	#print f_Output "$array[0]\t$factor\t$array[5]\t$score\t$pvalue\t$score1\t$pvalue1\n";
	#update the tfbs table;
	if ($score1 ne ''){#if there is ambiguity;
	    if($score > 0 && $score1 > 0){
		$score = 100;$pvalue = 1;
	    }else{
		$score = -2;$pvalue = 2;
	    }
	}
	#print "$score\t$pvalue\n";
	$dbh -> do(qq(update tfbs set anc_score = $score, anc_pvalue = $pvalue where fpid = $array[0]));
	#getc();
    }
    $sth->finish;
}

sub align
{
    my ($seq,$ref) = @_;
    my (@seq) = split(//, $seq);
    my (@ref) = split(//, $ref);
    my $length = length($seq);
    my $i = 0;
    for($i = 0; $i < $length; $i ++){
	if($seq[$i] eq $ref[$i]){
	    $seq[$i] = '.';
	}
    }
    return join("", @seq);
}
sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}

