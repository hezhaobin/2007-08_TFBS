########################
# July 9th 08
# To calculate Potential
#  for enhancers of both 
# species
# hebin
########################

use warnings;
use DBI;
prepareDbh();

#########################
#       structure       #
# region factor length Pocc_fp Pocc_all#
#########################


###############
# loading pwm #
###############
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

######################
# Retrieve sequences #
######################
#loop through each region for all relevant factors;
@factor = qw(Kr bcd hb prd twi);
foreach $factor(@factor){
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
	$mel_length = $sim_length = 0;
	$mel =~ tr/\-//d;
	$sim =~ tr/\-//d;
	$mel_length = length($mel);
	$sim_length = length($sim);
	$mel_Pocc = Potential($mel);
	$sim_Pocc = Potential($sim);
	print "$region\t$factor\t$mel_length\t$sim_length\t$mel_Pocc\t$sim_Pocc\n";
    }
}

sub Potential
{
    my $seq = shift;
    ##################
    # sliding window #
    ##################
    my $factor2 = $factor."2";
    my (@Pi) = ();
    for my $i(0..(length($seq)-$pwml{$factor2})){
	my $window = substr($seq, $i, $pwml{$factor2});
	my $plus = $window;
	$plus =~ tr/ACGT/0123/;
	my $minus = revcomp($window);
	$minus =~ tr/ACGT/0123/;
	my $splus = my $sminus = 0;
	for $j(0..($pwml{$factor2}-1)){
	    if(substr($plus, $j ,1) eq 'N'){
		$splus += ($$factor2[4*$j]+$$factor2[4*$j+3])*0.3+($$factor2[4*$j+2]+$$factor2[4*$j+1])*0.2;
		$sminus += ($$factor2[4*$j]+$$factor2[4*$j+3])*0.3+($$factor2[4*$j+2]+$$factor2[4*$j+1])*0.2;
	    }else{
		$splus += $$factor2[4*$j+substr($plus, $j, 1)];
		$sminus += $$factor2[4*$j+substr($minus, $j, 1)];
	    }
	}
	my $score = $splus >= $sminus ? $splus:$sminus;
	my $Pi = 0;
	$Pi = 1/(exp($ref{$factor2}-$score)+1);
	@Pi = (@Pi, $Pi);
    }
    my (@Potential) = ();
    my $maxp;
    my $start;
    my $c=0;
    while(@Pi && max(@Pi) > 0){
	$maxp = 0;
	$maxp = max2(@Pi);
	push(@Potential, $Pi[$maxp]);
	if(@Potential == 1){
	    $c = $Potential[0]/10000;
	}elsif($Pi[$maxp] < $c){
	    last;
	}
	$start = (($maxp-$pwml{$factor2}+1)>0) ? ($maxp-$pwml{$factor2}+1):0;
	splice(@Pi, $start, 2*$pwml{$factor2}-1, replicate(0,2*$pwml{$factor2}-1));
    }
    my $Potential = 0;
    for (@Potential){
	$Potential += $_;
    }
    return $Potential;
}

sub replicate
{
    my ($value, $no) = @_;
    my (@array) = ();
    while($no > 0){
	push(@array, $value);
	$no--;
    }
    return @array;
}

sub max2{
    my @array = @_;
    my $max = 0;
    my $i;
    for $i(0..$#array){
	if($array[$i] > $array[$max]){
	    $max = $i;
	}
    }
    return $max;
}
sub revcomp
{
    my $seq = shift;
    $seq =~ tr/ACGT/TGCA/;
    return join('',reverse(split(//, $seq)));
}

sub prepareDbh
{
    my $username = "hebin";
    my $password = "fruitfly";
    my $database = "hebin";

    my $dsn = "DBI:mysql:$database:localhost";
    our $dbh = DBI->connect($dsn,$username,$password);
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
