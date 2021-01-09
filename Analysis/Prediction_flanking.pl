################################
# perl Prediction_flanking.pl
# Created May 30th 2008
# To predict binding sites in
# both mel and sim
# modified July 18th 2008
# to output coordinates of 
# predicted sites
# modified Aug 2nd 2008
# Hebin
################################


use warnings;
use DBI;
prepareDbh();

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
$pwm = 'hb39';
$pwml = 9;
$c = 2.9;
$total = 0; $gapped = 0;
open f_Input, "./fasta/hb_enhancer_flanking.fa" ||
    die "cannot open file\n";
do{
    $line = <f_Input>;
    $region = substr($line, 1, 6);
    $mel = <f_Input>;
    <f_Input>;
    $sim = <f_Input>;
    %seq = ('mel', $mel,'sim',  $sim);
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
	@site = ($start, $end, $strand, $score, $seq);
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
	@site = ($start, $end, $strand, $score, $seq);
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
    if(0){
    print "mel\n";
    for (@melsite){
	print join("\t", @{$_}), "\n";
    }
    print "sim\n";
    for (@simsite){
	print join("\t", @{$_}), "\n";
    }
    getc();}
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
		push @combsite, [(@{$simsite[$m]}[0,1,2,3], 'sim')];
		$n++;
		$simspe++;
	    }
	    last;
	}
	if($n > $#simsite){
	    until($m > $#melsite){
		push @combsite, [(@{$melsite[$m]}[0,1,2,3], 'mel')];
		$m++;
		$melspe++;
	    }
	    last;
	}
	if($melsite[$m]->[0] == $simsite[$n]->[0] || $melsite[$m]->[1] == $simsite[$n]->[1]){
	    push @combsite, [(@{$melsite[$m]}[0,1,2,3], 'overlap')];
	    $m ++;$n++;
	    $overlap ++;
	}elsif($melsite[$m]->[0] < $simsite[$n]->[0]){
	    push @combsite, [(@{$melsite[$m]}[0,1,2,3], 'mel')];
	    $m++;
	    $melspe ++;
	}elsif($melsite[$m]->[0] > $simsite[$n]->[0]){
	    push @combsite, [(@{$simsite[$n]}[0,1,2,3], 'sim')];
	    $n++;
	    $simspe++;
	}
    }
    print "$region\t$overlap\t$melspe\t$simspe\n";
    if(0){
    for (@combsite){
	print join("\t", @{$_}), "\n";
    }
    getc();}

    ######################
    # with the previous
    # table of BS, infer
    # effects of changes
    ######################
    if(0){
    for $refBS(@combsite){
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
	for $i(1..$pwml){
	    $nuclmel=$nuclsim = '';
	    $nuclmel = substr($seqBS{mel}, $i-1, 1); $nuclsim = substr($seqBS{sim}, $i-1, 1);
	    if($nuclmel ne $nuclsim && $nuclsim ne 'N'){
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
		print "$factor\t$region\t",$refBS->[0]+$i-1, "\t",$p+1, "\t$type\t$anc2\t$evo2\t$change\n";
		#print join("\t",@{$refBS}), "\n";
		#printhash(%seqBS);
		#getc();
	    }
	}
    }}
}while(!eof(f_Input));
print "Total: $total\tGapped: $gapped\n";

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

