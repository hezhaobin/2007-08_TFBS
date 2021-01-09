########################
# June 29th 08
# To calculate Pocc for 
# enhancers as well as
# a p-value using 
# scrambled pwm
# hebin
########################

use warnings;
print "ok";
$factor = 'bcd24';
$pwml = 8;
$ref = 8.87;


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

$factor = 'bcd2';

open f_File, "./fasta/bcd_test.fasta";

while($line = <f_File>){
    $line =~ /(\S+)\s+\\(\S+)\\/;
    $region = $1;
    $seq = $2;#input enhancer sequence;
    $Pocc = 0;
    $Pocc = Pocc($seq, (0..($pwml-1)));
    $count = $pvalue = 0;
    open f_Permut, "./8permut";
    while($permut = <f_Permut>){
	chomp $permut;
	(@permut) = ();
	@permut = split(/\s+/, $permut);
	$Pocc_permut = 0;
	$Pocc_permut = Pocc($seq, @permut);
	$count ++ if($Pocc_permut > $Pocc);
    }
    close f_Permut;
    #print "Pocc ok\n";
    $pvalue = $count/1000;
    print "$region\tPocc = $Pocc\tp-value = $pvalue\n";
}

sub Pocc
{
    my ($seq,@map) = @_;
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
	    $splus += $$factor[4*$map[$j]+substr($plus, $j, 1)];
	    $sminus += $$factor[4*$map[$j]+substr($minus, $j, 1)];
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
