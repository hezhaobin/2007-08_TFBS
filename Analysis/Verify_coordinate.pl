################################
#  perl Verify_coordinate.pl
#  Created May 26th 2008
#  To verify the coordinate
#  of the prediction data
#  Hebin
################################


use warnings;
use DBI;
prepareDbh();


####################
# Pick up a factor #
####################
print "PWM length:";
$length = <STDIN>;
chomp $length;
open f_Input, $ARGV[0];
while($line = <f_Input>){
    chomp $line;
    (@array) = ();
    @array = split(/\s+/, $line);#1 region 2 pos 3 strand 4 score 5 pvalue 6 sequence;
    $sth0 = $dbh -> prepare(qq(select start from enhancer where region = '$array[0]'));
    $sth0 -> execute;
    $sth0 -> bind_columns(\$start);
    $sth0 -> fetch;
    $a = $start+$array[1]-1; $b = $a + $length -1;
    $sth = $dbh -> prepare(qq(select mel
			      from tfbs_poly
			      where region = '$array[0]' AND coordinate between $a and $b));
    $sth -> execute;
    $sth -> bind_columns(\$s);
    $mel = '';
    while($sth->fetch){
	$mel = $mel.$s;
    }
    $mel =~ tr/\-//d;
    if($array[2] eq '-'){
	$array[5] =~ tr/ACGT/TGCA/;
	(@array2) = ();
	@array2 = split(//, $array[5]);
	$array[5] = join('', reverse(@array2));
    }
    if($mel ne $array[5]){
	print "Disagree at $array[0]\:$array[1]\n$mel\t$array[5]\n";
	getc();
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

