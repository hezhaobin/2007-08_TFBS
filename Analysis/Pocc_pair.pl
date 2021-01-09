########################
# July 9th 08
# To calculate Pocc for 
# enhancers of both 
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
@factor = qw(Antp Deaf1 Dfd Kr Mad Trl Ubx abd-A ap bcd br-Z1 br-Z2 br-Z3 brk cad dl en eve hb kni ovo pan prd slbo tin tll twi vvl z zen);
foreach $factor(@factor){
    $sth0 = $dbh -> prepare(qq(select distinct(region) from tfbs where factor = '$factor'));
    $sth0 -> execute;
    $sth0 -> bind_columns(\$region);
    while($sth0 -> fetch){
	if(!defined($region)){
	    next;
	}
	$sth1 = $dbh->prepare(qq(select mel, sim_alleles
				 from tfbs_poly
				 where region = '$region'));
	$sth1->execute;
	(@array) = (); $mel = $sim = '';
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
	$Pocc = 0;
	$mel_Pocc = Pocc($mel);
	$sim_Pocc = Pocc($sim);
	print "$region\t$factor\t$mel_length\t$sim_length\t$mel_Pocc\t$sim_Pocc\n";
    }
}

sub Pocc
{
    my $seq = shift;
    ##################
    # sliding window #
    ##################
    my (@Pi) = ();
    for my $i(0..(length($seq)-$pwml{$factor})){
	my $window = substr($seq, $i, $pwml{$factor});
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
