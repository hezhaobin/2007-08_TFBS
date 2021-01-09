################################
# Modified from Precition.pl
# To compare random seq with
# enhancer sequence in the 
# density of binding sites
# Hebin
################################


use warnings;
no warnings "recursion";
use Graph;
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
#$total = 0; $gapped = 0; $divergent = 0; (%fp) = qw(overlap 0 mel 0 sim 0);
# to store the 2*2 table (-Inf, -1], [1, Inf), (-1,0], (0,1);

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
    (@array) = (); $mel = '';
    while(@array = $sth1->fetchrow_array){
	$mel = $mel.$array[1];
    }
    @randSeq = ();
    for $i(0..99){ ## loop 100 times
	$randSeq[$i] = dinucleotide_shuffle($mel);
    }
    ##########
    # patser #
    ##########
    $patser_seq = '';
    $patser_seq = "mel\t\\$mel\\";
    $melResult = `echo -n '$patser_seq' |
                  ../patser/patser -A a:t 0.3 c:g 0.2 -m ../OptimalPatserMatrices/$pwm -b 1 -u2 -ls $c -s -c |
                  grep "position"`;
    $melNum = scalar(split(/\n/, $melResult)); 
    @randResult = ();
    @randNum = ();
    for $i(0..99){
	$patser_seq = '';
	$patser_seq = "rand$i\t\\$randSeq[$i]\\";
	$randResult[$i] = `echo -n '$patser_seq' |
                           ../patser/patser -A a:t 0.3 c:g 0.2 -m ../OptimalPatserMatrices/$pwm -b 1 -u2 -ls $c -s -c |
                           grep "position"`;
	$randNum[$i] = scalar(split(/\n/, $randResult[$i]));
    }
    print "$region\n$melNum\n",join(",",@randNum),"\n\n";
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

