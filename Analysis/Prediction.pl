################################
# perl Unbiased_prediction.pl
# Created May 30th 2008
# To predict binding sites in
# both mel and sim
# modified July 18th 2008
# to output coordinates of 
# predicted sites
# modified Sep 16th 2008
# to count the 2*2 table
# modified Jun 23rd 2009 @@
# to exclude the mel footprints
# Hebin
################################


use warnings;
use DBI;
prepareDbh();
#print "factor\tregion\tcoor\tpos\ttype\tanc\tevo\teffect\n";

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

######################
# Retrieve sequences #
######################
#print "Factor:";
#$factor = <STDIN>;
#chomp $factor;
$factor = 'hb';
$pwm = 'hb';
$pwml = 9;
$c = 4.0;
$total = 0; $gapped = 0; $divergent = 0; (%fp) = qw(overlap 0 mel 0 sim 0);
# to store the 2*2 table (-Inf, -1], [1, Inf), (-1,0], (0,1);
@mel_change = @sim_change = @Amb_change = (0,0,0,0);

$sth0 = $dbh -> prepare(qq(select distinct(region) from tfbs where factor = '$factor'));
$sth0 -> execute;
$sth0 -> bind_columns(\$region);
while($sth0 -> fetch){
    if(!defined($region)){
	next;
    }
    $sth1 = $dbh->prepare(qq(select anc, mel, sim_alleles
			     from tfbs_poly
			     where region = '$region'));
    $sth1->execute;
    (@array) = (); $mel = $anc = $sim = '';
    while(@array = $sth1->fetchrow_array){
	$mel = $mel.$array[1];
	$anc = $anc.$array[0];
	for($i = 0; $i < 5; $i++){
	    if(substr($array[2], -(2*$i+1), 1) ne 'N'){
		last;
	    }
	}
	$sim = $sim.substr($array[2], -(2*$i+1), 1);
    }
    %seq = ('anc', $anc, 'mel', $mel,'sim',  $sim);
    ##########
    # patser #
    ##########
    for $species(('mel', 'sim')){
	$patser_seq = '';
	$patser_seq = "$species\t\\$seq{$species}\\";
	$result{$species} = `echo -n '$patser_seq' |
                            ../patser/patser -A a:t 0.3 c:g 0.2 -m ../OptimalPatserMatrices/$pwm -b 1 -u2 -ls $c -s -c |
                            grep "position"`;
    }
    ###################
    # predict for mel #
    ###################
    # record: total no of predicted sites, gapped sites, for each change--region, pos, type, effect;
    # transform coordinates to relative position;
    (%coordinate) = ();
    $n = 0;
    for $i(1..length($mel)){
	if(substr($mel, $i-1, 1) ne '-'){
	    $n ++;
	    $coordinate{$n} = $i;
	}
    }
    # deal with overlapping site
    (@melsite) = ();@oldsite = (-50, -50, '+', 0);(@overlap) = ();
    for $line(split(/\n/, $result{mel})){
	###############################
	# data structure:
	# rel.pos strand score pvalue
	###############################
	(@site) = ();$strand = '+';$pos = $start = $end = $score = -1;$seq = '';
	($pos, $score, $seq) = (split(/\s+/, $line))[3,5,9];
	if($pos =~ /C/){
 	    $strand = '-';
	    $pos =~ tr/C//d;
	}
	$start = $coordinate{$pos};
	$end = $coordinate{$pos+$pwml-1};
	@site = ($start, $end, $strand, $score, $seq, $pos);
	if($site[0]-$oldsite[0] < $pwml){
	    if($site[3] <= $oldsite[3]){
		next;
	    }else{
		push @overlap, pop @melsite;
	    }
	}
	@oldsite = @site;
	push @melsite, [@site];
    }
    ###################
    # predict for sim #
    ###################
    # record: total no of predicted sites, gapped sites, for each change--region, pos, type, effect;
    # transform coordinates to relative position;
    (%coordinate) = ();
    $n = 0;
    for $i(1..length($sim)){
	if(substr($sim, $i-1, 1) ne '-'){
	    $n ++;
	    $coordinate{$n} = $i;
	}
    }
    # deal with overlapping site
    (@simsite) = ();@oldsite = (-50, -50, '+', 0);(@overlap) = ();
    for $line(split(/\n/, $result{sim})){
	###############################
	# data structure:
	# rel.pos strand score pvalue
	###############################
	(@site) = ();$strand = '+';$pos = $start = $end = $score = -1;$seq = '';
	($pos, $score, $seq) = (split(/\s+/, $line))[3,5,9];
	if($pos =~ /C/){
 	    $strand = '-';
	    $pos =~ tr/C//d;
	}
	$start = $coordinate{$pos};
	$end = $coordinate{$pos+$pwml-1};
	@site = ($start, $end, $strand, $score, $seq, $pos);
	if($site[0]-$oldsite[0] < $pwml){
	    if($site[3] <= $oldsite[3]){
		next;
	    }else{
		push @overlap, pop @simsite;
	    }
	}
	@oldsite = @site;
	push @simsite, [@site];
    }
    #print "$region\nmel\n";
    for (@melsite){
	#print join("\t", @{$_}), "\n";
    }
    #print "sim\n";
    for (@simsite){
	#print join("\t", @{$_}), "\n";
    }
    #getc();
    #####################
    # estimate rate of 
    # of binding sites
    # turnover and 
    # sliding
    # modified July 18
    #####################
    (@combsite) = ();
    $m = $n = $flag = 0;
    $melspe = $simspe = $overlap = $slide = 0;
    while(1){
	if($m > $#melsite){
	    until($n > $#simsite){
		push @combsite, [(@{$simsite[$m]}[0,1,2,3,5], 'sim')];
		$n++;
		$simspe++;
	    }
	    last;
	}
	if($n > $#simsite){
	    until($m > $#melsite){
		push @combsite, [(@{$melsite[$m]}[0,1,2,3,5], 'mel')];
		$m++;
		$melspe++;
	    }
	    last;
	}
	if($melsite[$m]->[0] == $simsite[$n]->[0] || $melsite[$m]->[1] == $simsite[$n]->[1]){
	    push @combsite, [(@{$melsite[$m]}[0,1,2,3,5], 'overlap')];
	    $m ++;$n++;
	    $overlap ++;
	}elsif($melsite[$m]->[0] < $simsite[$n]->[0]){
	    push @combsite, [(@{$melsite[$m]}[0,1,2,3,5], 'mel')];
	    $m++;
	    $melspe ++;
	}elsif($melsite[$m]->[0] > $simsite[$n]->[0]){
	    push @combsite, [(@{$simsite[$n]}[0,1,2,3,5], 'sim')];
	    $n++;
	    $simspe++;
	}
    }
    #print "$region\t$overlap\t$melspe\t$simspe\t$slide\n";
    #judge if a site is footprinted or not;
    $sth2 = $dbh->prepare(qq(select start from enhancer where region = '$region'));
    $sth2 -> execute;
    $sth2 -> bind_columns(\$region_start);
    $sth2->fetch;
    for (@combsite){
	#print join("\t", @{$_}), "\n";
	#count the number of footprints that are considered mel specific;
	if($_->[5] eq 'sim'){
	    next;
	}
	$tfbs_start = 0;
	$tfbs_start = $_->[4] + $region_start - 1;
	$sth3 = $dbh -> prepare(qq(select * from tfbs 
				   where region = '$region' and factor = '$factor' and abs(tfbs_start-$tfbs_start) < $pwml));
	$rv = $sth3 -> execute; 
	if($rv ne "0E0"){
	    $fp{$_->[5]} ++;
	}
    }
    #getc();

    ######################
    # with the previous
    # table of BS, infer
    # effects of changes
    ######################
    for $refBS(@simsite){
	#retrieve seq;
	%seqBS = ('mel', '', 'sim', '', 'anc', '');
	for (keys %seq){
	    $seqBS{$_} = substr($seq{$_}, $refBS->[0]-1, $refBS->[1]-$refBS->[0]+1);
	}
	#printhash(%seqBS);
	#getc();
	$total ++;
	if($seqBS{mel} =~ /\-/ || $seqBS{sim} =~ /\-/){
	    $gapped ++;
	    next;
	}
	$flag = 0;
	for $i(1..$pwml){
	    $nuclmel=$nuclsim = '';
	    $nuclmel = substr($seqBS{mel}, $i-1, 1); $nuclsim = substr($seqBS{sim}, $i-1, 1);
	    if($nuclmel ne $nuclsim && $nuclsim ne 'N'){
		$flag = 1;
		#solve the ancestral state using parsimony;
		$nuclanc = substr($seqBS{anc}, $i-1, 1);
		$type = ''; $nuclevo = ''; $change = '';$p = -1;
		if($nuclanc eq '?'){
		    $nuclanc = $nuclmel;
		    $type = 'Amb';
		    $nuclevo = $nuclsim;
		}else{
		    $type = $nuclanc eq $nuclmel ? 'sim':'mel';
		    $nuclevo = $nuclanc eq $nuclmel ? $nuclsim:$nuclmel;
		}
		$anc2 = $nuclanc;$evo2 = $nuclevo;
		#evaluate direction of changes;
		if($refBS->[2] eq '+'){
		    $p = $i - 1;
		    $nuclanc =~ tr/ACGT/0123/;
		    $nuclevo =~ tr/ACGT/0123/;
		}elsif($refBS->[2] eq '-'){
		    $p = $pwml-$i;
		    $anc2 =~ tr/ACGT/TGCA/;
		    $evo2 =~ tr/ACGT/TGCA/;
		    $nuclanc =~ tr/ACGT/3210/;
		    $nuclevo =~ tr/ACGT/3210/;
		}else{
		    die join("\t",@{$refBS}),"\n";
		}
		$change = $$factor[4*$p+$nuclevo] - $$factor[4*$p+$nuclanc];
		$name = $type."\_change";
		$index = -1;
		if($change <= -1){
		    $index = 0;
		}elsif($change > -1 && $change <=0){
		    $index = 2;
		}elsif($change >0 && $change < 1){
		    $index = 3;
		}elsif($change >= 1){
		    $index = 1;
		}
		$$name[$index] ++;
		#print "$factor\t$region\t",$refBS->[0]+$i-1, "\t",$p+1, "\t$type\t$anc2\t$evo2\t$change\n";
		#print join("\t",@{$refBS}), "\n";
		#printhash(%seqBS);
		#getc();
	    }
	}
	$divergent ++ if($flag == 1);
    }
}
#print "Overlap_fp: $fp{overlap}\tmel_fp: $fp{mel}\n";
print "Total: $total\tGapped: $gapped\tdivergent: $divergent\nmel\tsim\tamb\n";
for $i(0..3){
    print "$mel_change[$i]\t$sim_change[$i]\t$Amb_change[$i]\n";
}

sub printhash{
    my %hash = @_;
    for (keys %hash){
	print "$_\t$hash{$_}\n";
    }
}
sub printBS{
    my @melsite = @_;
    print "begin\tend\tstrand\tscore\tseq\n";
    for (@melsite){
	print join("\t", @{$_}), "\t", substr($seq{mel}, $_->[0]-1, $_->[1]-$_->[0]), "\n";
    }
}
sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}

