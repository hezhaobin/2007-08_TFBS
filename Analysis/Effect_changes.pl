#################################
# perl Effect_changes.pl
# Created Dec 26th 07
# To polarize the substitutions
# within binding sites
# Modified Jan 8th 07
# To solve the bug of not 
# considering which strand (+/-)
# the feature is on
# Modified Apr 29th 08
# to include polymorphic sites
# Modified Jul 24th 08
# now calculate effects in forms
# of change in Pi rather than
# score
# a weak site even with a big
# change in score wouldn't 
# matter a lot
# hebin
#! /usr/bin/perl -W
#################################


#open f_Output, ">../Result/effects_changes.txt" ||
#    die "Cannot open file";
#print f_Output "region\tfpid\tfactor\tstrand\tscore\tcoordinate\tpos\tspecies\tancestral\tevolved\tchange\n";

###############
# loading pwm #
###############
open f_Input, "../OptimalPatserMatrices/weight_matrix.txt" ||
    die "Cannot open weight_matrix.txt";
print "Region\tfpid\tfactor\tanc_score\tcoordinate\tpos\tanc\tevo\ttype\teffects\tPi\tfreq\talleles\n";
open f_Input, "../OptimalPatserMatrices/weight_matrix.txt" ||
    die "Cannot open weight_matrix.txt";
(%pwml) = ();
($ref) = ();
while(!eof(f_Input)){
    $line = <f_Input>;
    $line =~ /Matrices\/(\S+)\"\:\ (\d+)/;
    $factor = $1; $width = $2;
    $pwml{$factor} = $width;
    $ref{$factor} = 0;
    (@$factor) = ();
    <f_Input>;
    for($i = 0; $i < $width; $i ++){
	$line = <f_Input>;
	(@array) = ();
	@array = split(/\s+/, $line);
	$array[0] ne '' || shift(@array);#discard the first empty element;
	push(@$factor, @array);
	#pick the highest score and add to the ref;
	$ref{$factor} += max(@array);
    }
    #print "$factor uploaded\n";
    <f_Input>;
}
close(f_Input);

## driving table: tfbs ##
use DBI;
prepareDbh();

$sth = $dbh->prepare(qq(SELECT fpid, factor,region, tfbs_start, tfbs_end, anc_score, strand
			FROM tfbs 
			WHERE gapped = 'N'));
$sth->execute;
(@array) = (); #0:fpid; 1:factor; 2:region; 3:tfbs_start; 4:tfbs_end; 5:anc_score; 6:strand;
while(@array = $sth->fetchrow_array){
    $factor = $array[1];
    $region = $array[2];
    $strand = $array[6];
    $sth3 = $dbh->prepare(qq(SELECT anc, mel
			     FROM tfbs_poly
			     WHERE region = '$region' AND coordinate between $array[3] and $array[4]));
    $sth3->execute;
    $sth3->bind_columns(\$anc, \$mel);
    $anc_seq = '';
    while($sth3->fetch){
	if($anc ne '?'){
	    $anc_seq = $anc_seq.$anc;
	}else{
	    $anc_seq = $anc_seq.$mel;
	}
    }
    $sth2 = $dbh->prepare(qq(SELECT coordinate, mel, sim_allele, anc, poly_freq, allele_number, poly_Or_not
			     FROM tfbs_poly
			     WHERE region = '$region' AND coordinate between $array[3] and $array[4]));
    $sth2->execute;
    $sth2->bind_columns(\$coordinate, \$mel, \$sim, \$anc, \$polyfreq, \$allele_no, \$poly_Or_not);
    $evo_seq = '';
    while($sth2->fetch){
	#solve the ancestral state using parsimony;
	$type = ''; $evo = ''; $change = 0; $effect = 0;$p = -1;
	if($poly_Or_not eq 'div'){
	    if($anc eq '?'){
		$anc = $mel;
		$type = 'Amb';
		$evo = $sim;
	    }else{
		$type = $anc eq $mel ? 'sim':'mel';
		$evo = $anc eq $mel ? $sim:$mel;
	    }
	}elsif($poly_Or_not eq 'poly'){
	    $evo = $sim;
	    $type = 'poly';
	}else{
	    next;
	}
	if(substr($anc_seq, $coordinate-$array[3], 1) ne $anc){
	    die "why???!!!\n";
	}
	$evo_seq = $anc_seq;
	substr($evo_seq, $coordinate-$array[3],1) = $evo;
	$effect = Pi($evo_seq)-Pi($anc_seq);
	$anc2 = $anc;$evo2 = $evo;
	#evaluate direction of changes;
	if($strand eq '+'){
	    $p = $coordinate - $array[3];
	    $anc =~ tr/ACGT/0123/;
	    $evo =~ tr/ACGT/0123/;
	}elsif($strand eq '-'){
	    $p = $array[4] - $coordinate;
	    $anc2 =~ tr/ACGT/TGCA/;
	    $evo2 =~ tr/ACGT/TGCA/;
	    $anc =~ tr/ACGT/3210/;
	    $evo =~ tr/ACGT/3210/;
	}else{
	    die "$fpid\n";
	}
	$change = $$factor[4*$p+$evo] - $$factor[4*$p+$anc];
	#print "$array[0]\t$array[1]\t$strand\t$type\t$p\t$anc\t$evo\t$change\t$polyfreq\t$allele_no\n";
	#print "nt\tA\tC\tG\tT\n";
	$a = 0;
	while($$factor[4*$a] ne '' && 0){
	    print "$a";
	    for($i = 0; $i < 4; $i ++){
		print "\t$$factor[4*$a+$i]";
	    }
	    print "\n";
	    $a ++;
	}
	#getc();
	print "$region\t$array[0]\t$array[1]\t$array[5]\t$coordinate\t$p\t$anc2\t$evo2\t$type\t$change\t$effect\t$polyfreq\t$allele_no\n";
    }
    $sth2->finish;
}
$sth->finish;
$dbh->disconnect;

sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
}

sub Pi
{
    my $window = shift;
    my $plus = $window;
    $plus =~ tr/ACGT/0123/;
    my $minus = revcomp($window);
    $minus =~ tr/ACGT/0123/;
    my $splus = my $sminus = 0;
    for $j(0..($pwml{$factor}-1)){
	if(substr($plus, $j ,1) eq 'N'){
	    $splus += ($$factor[4*$j]+$$factor[4*$j+3])*0.3+($$factor[4*$j+2]+$$factor[4*$j+1])*0.2;
	    $sminus += ($$factor[4*$j]+$$factor[4*$j+3])*0.3+($$factor[4*$j+2]+$$factor[4*$j+1])*0.2;
	}else{
	    $splus += $$factor[4*$j+substr($plus, $j, 1)];
	    $sminus += $$factor[4*$j+substr($minus, $j, 1)];
	}
    }
    my $score = $splus >= $sminus ? $splus:$sminus;
    my $Pi = 0;
    $Pi = 1/(exp($ref{$factor}-$score)+1);
    return $Pi;
}

sub revcomp
{
    my $seq = shift;
    $seq =~ tr/ACGT/TGCA/;
    return join('',reverse(split(//, $seq)));
}

sub max
{
    my @array = @_;
    for $i(1..$#array){
	if($array[$i-1] > $array[$i]){
	    @array[$i-1, $i] = @array[$i, $i-1];
	}
    }
    return $array[-1];
}
