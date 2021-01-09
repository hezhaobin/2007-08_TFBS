#################################
# perl compare_selex.pl
# Created Dec 26th 07
# To polarize the substitutions
# within binding sites
# Modified Jan 8th 07
# To solve the bug of not 
# considering which strand (+/-)
# the feature is on
# Modified Apr 29th 08
# to include polymorphic sites
# Modified May 14th 08
# to validate the results using
# selex pwm
# hebin
#! /usr/bin/perl -W
#################################


###############
# loading pwm #
###############
open f_Input, "../OptimalPatserMatrices/weight_matrix.txt" ||
    die "Cannot open weight_matrix.txt";
$fac = 'twi';
$matrix = $fac.'2';
$pos{bcd} = 7;
$pos{hb} = 9;
$pos{prd} = 10;
$pos{twi} = 14;
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

$result = `grep "$fac" ../Result/effect_changes.txt`;
foreach $line(split(/\n/, $result)){
    @array = split(/\s+/, $line);
    ($pos, $anc, $evo, $effect) = @array[(5..7,9)];
    #$p = $pos;
    #$anc =~ tr/ACGT/0123/;
    #$evo =~ tr/ACGT/0123/;
    $p = 14-$pos;
    if($pos < 3){
	print join("\t", (@array, 'na')), "\n";
    }else{
    $anc =~ tr/ACGT/3210/;
    $evo =~ tr/ACGT/3210/;
    $change = $$matrix[4*$p+$evo] - $$matrix[4*$p+$anc];
    print join("\t", (@array, $change)), "\n";
}
    #getc();
}
