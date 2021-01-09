################################
# perl Energy_pair_plot.pl
# Created Jun 17th 08
# To plot energy pairs for all
# possible sliding windows in 
# mel and sim
# Hebin
################################


use warnings;
use DBI;
prepareDbh();
print "region\tmel\tsim\n";

if(0){
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
}

######################
# Retrieve sequences #
######################
$factor = 'bcd';
$pwm = 'bcd23';
$pwml = 8;
$total = 0; $gapped = 0;
# find all the regions bound by the factor #;
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
    $seqlength = length($mel);
    for $i(0..($seqlength-$pwml)){
	$total ++;
	$mel_seq = substr($mel, $i, $pwml);
	$sim_seq = substr($sim, $i, $pwml);
	if($mel_seq =~ /N|\-/ || $sim_seq =~ /N|\-/){
	    $gapped ++;
	    next;
	}
	$patser_seq = '';
	$patser_seq = "mel\t\\$mel_seq\\";
	$result = `echo -n '$patser_seq' |
                            ../patser/patser -A a:t 0.3 c:g 0.2 -m ../OptimalPatserMatrices/$pwm -b 1 -u2 -s -c -t|
                            grep "position"`;
	$mel_result = '';
	$result =~ /score\=\s+(\S+)/;
	$mel_result = $1;
	$patser_seq = '';
	$patser_seq = "sim\t\\$sim_seq\\";
	$result = `echo -n '$patser_seq' |
                            ../patser/patser -A a:t 0.3 c:g 0.2 -m ../OptimalPatserMatrices/$pwm -b 1 -u2 -s -c -t|
                            grep "position"`;
	$sim_result = '';
	$result =~ /score\=\s+(\S+)/;
	$sim_result = $1;
	print "$region\t$mel_result\t$sim_result\n";
    }
}
#print "Total: $total\tGapped: $gapped\n";

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

